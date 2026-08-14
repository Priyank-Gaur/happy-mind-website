import { useEffect, useMemo, useState } from "react";
import { format, isSameDay } from "date-fns";
import {
  CalendarIcon,
  Clock,
  Loader2,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  TIME_SLOTS,
  savePendingBooking,
  getPendingBooking,
  bookings,
  type PreferredSlot,
} from "@/lib/bookings";
import { fetchCurrentUser } from "@/lib/happimyndAuth";

export type BookServiceOption = {
  key: string;
  name: string;
  label: string;
};

export const SERVICE_OPTIONS: BookServiceOption[] = [
  {
    key: "solv",
    name: "SOLV",
    label: "SOLV (One-on-one growth conversations)",
  },
  {
    key: "happitalk",
    name: "HappiTALK",
    label: "HappiTALK (Therapeutic Counselling)",
  },
];

type SlotErrors = {
  date1?: string;
  slot1?: string;
  date2?: string;
  slot2?: string;
};

const BookSessionModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [selectedServiceKey, setSelectedServiceKey] = useState<string>("solv");

  // Slots state (Required: Slot 1 and Slot 2)
  const [date1, setDate1] = useState<Date | undefined>(undefined);
  const [slot1, setSlot1] = useState<string>("");
  const [date2, setDate2] = useState<Date | undefined>(undefined);
  const [slot2, setSlot2] = useState<string>("");
  const [slotErrors, setSlotErrors] = useState<SlotErrors>({});

  // User details state (optional / background profile)
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Reset/sync dialog state whenever opened
  useEffect(() => {
    if (isOpen) {
      setSlotErrors({});
      setSubmitting(false);

      // Check if there are pending saved slots to restore
      const pending = getPendingBooking();
      if (pending) {
        if (pending.serviceKey) setSelectedServiceKey(pending.serviceKey);
        if (pending.slot1?.date) setDate1(new Date(pending.slot1.date));
        if (pending.slot1?.slot) setSlot1(pending.slot1.slot);
        if (pending.slot2?.date) setDate2(new Date(pending.slot2.date));
        if (pending.slot2?.slot) setSlot2(pending.slot2.slot);
        if (pending.name) setName(pending.name);
        if (pending.email) setEmail(pending.email);
        if (pending.phone) setPhone(pending.phone);
      }

      // Also try fetching current authenticated user profile
      const controller = new AbortController();
      fetchCurrentUser(controller.signal).then((state) => {
        if (controller.signal.aborted) return;
        if (state.status === "authenticated") {
          setName((prev) => prev || state.user.name);
          setEmail((prev) => prev || state.user.email);
          setPhone((prev) => prev || state.user.phone);
        }
      });

      return () => controller.abort();
    }
  }, [isOpen]);

  const activeService = useMemo(() => {
    return (
      SERVICE_OPTIONS.find((s) => s.key === selectedServiceKey) ||
      SERVICE_OPTIONS[0]
    );
  }, [selectedServiceKey]);

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const validateSlots = (): boolean => {
    const next: SlotErrors = {};

    if (!date1) next.date1 = "Please select Preferred Date 1.";
    if (!slot1) next.slot1 = "Please select Preferred Time Slot 1.";
    if (!date2) next.date2 = "Please select Preferred Date 2.";
    if (!slot2) next.slot2 = "Please select Preferred Time Slot 2.";

    if (
      date1 &&
      date2 &&
      slot1 &&
      slot2 &&
      isSameDay(date1, date2) &&
      slot1 === slot2
    ) {
      next.slot2 = "Preferred Slot 2 must be different from Preferred Slot 1.";
    }

    setSlotErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleBookNow = async () => {
    if (!validateSlots()) return;
    if (!date1 || !date2 || !slot1 || !slot2) return;

    setSubmitting(true);

    const slot1Data: PreferredSlot = {
      date: date1,
      dateFormatted: format(date1, "yyyy-MM-dd"),
      slot: slot1,
    };
    const slot2Data: PreferredSlot = {
      date: date2,
      dateFormatted: format(date2, "yyyy-MM-dd"),
      slot: slot2,
    };

    // Save date, time, and service selection locally so it is restored when redirected later
    savePendingBooking({
      serviceKey: selectedServiceKey,
      serviceName: activeService.name,
      name,
      email,
      phone,
      slot1: slot1Data,
      slot2: slot2Data,
    });

    bookings.add({
      service: activeService.name,
      serviceKey: selectedServiceKey,
      name,
      email,
      phone,
      date: format(date1, "yyyy-MM-dd"),
      slot: slot1,
      date2: format(date2, "yyyy-MM-dd"),
      slot2: slot2,
    });

    /* NOTE: The redirection link is left empty for now as requested because the page
       will be attached later. The date and time slots are saved so when the user is later
       redirected, they won't need to re-enter the slots. Simply close the modal. */

    setSubmitting(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[92vh] gap-0 overflow-y-auto rounded-3xl border-0 bg-background p-0 shadow-xl sm:max-w-xl">
        {/* Branded Dialog Header */}
        <div className="relative overflow-hidden rounded-t-3xl bg-primary/10 px-6 py-5 border-b border-primary/10">
          <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-primary/20 blur-2xl" />
          <DialogHeader className="relative space-y-1 text-left">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-background/80 backdrop-blur-sm px-3 py-1 text-xs font-semibold text-primary border border-primary/20">
                <Sparkles className="h-3.5 w-3.5" /> {activeService.name}
              </span>
            </div>
            <DialogTitle className="text-2xl font-bold tracking-tight text-foreground">
              Book a Session
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Reserve a 1:1 {activeService.name} session. Select 2 preferred date and time slots.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-6">
          {/* SINGLE STEP BOOKING FORM */}
          <div className="space-y-5">
            {/* Service Selection Dropdown */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground/80">
                Service
              </label>
              <Select
                value={selectedServiceKey}
                onValueChange={(v) => {
                  setSelectedServiceKey(v);
                  setSlotErrors({});
                }}
              >
                <SelectTrigger className="h-11 w-full rounded-2xl border border-border bg-background px-4 font-medium shadow-sm">
                  <span className="flex items-center gap-2 truncate text-sm">
                    <Sparkles className="h-4 w-4 shrink-0 text-primary" />
                    <SelectValue placeholder="Select Service" />
                  </span>
                </SelectTrigger>
                <SelectContent className="rounded-2xl">
                  {SERVICE_OPTIONS.map((s) => (
                    <SelectItem
                      key={s.key}
                      value={s.key}
                      className="rounded-xl font-medium text-xs cursor-pointer"
                    >
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Requirement notice box */}
            <div className="rounded-2xl bg-amber-500/10 border border-amber-500/30 p-3.5 text-xs text-amber-900 dark:text-amber-200">
              <p className="font-semibold">Selection Requirement:</p>
              <p className="mt-0.5 text-[11px] opacity-90">
                Please select <strong>2 preferred date/time slots</strong> for your session. These are two preferences for the same session.
              </p>
            </div>

            {/* Preferred Slot 1 */}
            <SlotPickerBlock
              title="Preferred Slot 1"
              date={date1}
              slot={slot1}
              dateError={slotErrors.date1}
              slotError={slotErrors.slot1}
              minDate={today}
              onDateChange={(d) => {
                setDate1(d);
                setSlotErrors((prev) => ({ ...prev, date1: undefined, slot2: undefined }));
              }}
              onSlotChange={(v) => {
                setSlot1(v);
                setSlotErrors((prev) => ({ ...prev, slot1: undefined, slot2: undefined }));
              }}
            />

            {/* Preferred Slot 2 */}
            <SlotPickerBlock
              title="Preferred Slot 2"
              date={date2}
              slot={slot2}
              dateError={slotErrors.date2}
              slotError={slotErrors.slot2}
              minDate={today}
              disabledSlot={
                date1 && date2 && isSameDay(date1, date2) ? slot1 : undefined
              }
              onDateChange={(d) => {
                setDate2(d);
                if (d && date1 && isSameDay(d, date1) && slot2 && slot2 === slot1) {
                  setSlot2("");
                }
                setSlotErrors((prev) => ({ ...prev, date2: undefined, slot2: undefined }));
              }}
              onSlotChange={(v) => {
                setSlot2(v);
                setSlotErrors((prev) => ({ ...prev, slot2: undefined }));
              }}
            />

            <div className="flex justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="ghost"
                onClick={onClose}
                className="h-11 rounded-full px-6 text-sm font-semibold"
              >
                Cancel
              </Button>
              <Button
                type="button"
                disabled={submitting}
                onClick={handleBookNow}
                className="h-11 rounded-full bg-primary text-primary-foreground px-8 text-sm font-semibold shadow-md hover:bg-primary/90 cursor-pointer"
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                  </>
                ) : (
                  <>
                    Book Now <ArrowRight className="ml-1.5 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

/** One Preferred Date + Preferred Time Slot Picker Block */
function SlotPickerBlock({
  title,
  date,
  slot,
  dateError,
  slotError,
  minDate,
  disabledSlot,
  onDateChange,
  onSlotChange,
}: {
  title: string;
  date: Date | undefined;
  slot: string;
  dateError?: string;
  slotError?: string;
  minDate: Date;
  disabledSlot?: string;
  onDateChange: (d: Date | undefined) => void;
  onSlotChange: (v: string) => void;
}) {
  const [pickerOpen, setPickerOpen] = useState(false);

  return (
    <div className="space-y-2 rounded-2xl bg-muted/40 p-3.5 border border-border/50">
      <p className="text-xs font-bold uppercase tracking-wider text-primary">
        {title} <span className="text-destructive">*</span>
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        {/* Date Selector */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-foreground/80">
            Preferred Date
          </label>
          <Popover open={pickerOpen} onOpenChange={setPickerOpen}>
            <PopoverTrigger asChild>
              <button
                type="button"
                className={cn(
                  "flex h-10 w-full items-center gap-2 rounded-xl bg-background border border-border px-3.5 text-left text-xs shadow-sm transition hover:bg-muted/50 cursor-pointer",
                  dateError ? "ring-2 ring-destructive/50" : "",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                <span className="truncate">
                  {date ? format(date, "EEE, d MMM yyyy") : "Select date"}
                </span>
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto rounded-2xl p-0 z-[300]" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(d) => {
                  onDateChange(d);
                  setPickerOpen(false);
                }}
                disabled={(d) => d < minDate}
                fromDate={minDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {dateError && <p className="text-[11px] font-medium text-destructive">{dateError}</p>}
        </div>

        {/* Time Slot Selector */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-foreground/80">
            Time Slot
          </label>
          <Select value={slot} onValueChange={onSlotChange}>
            <SelectTrigger
              className={cn(
                "h-10 w-full rounded-xl border border-border bg-background px-3.5 text-xs shadow-sm cursor-pointer",
                slotError ? "ring-2 ring-destructive/50" : ""
              )}
            >
              <span className="flex items-center gap-2 truncate">
                <Clock className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                <SelectValue placeholder="Select time slot" />
              </span>
            </SelectTrigger>
            <SelectContent className="max-h-60 rounded-2xl z-[300]">
              {TIME_SLOTS.map((s) => (
                <SelectItem
                  key={s}
                  value={s}
                  disabled={s === disabledSlot}
                  className="rounded-xl text-xs cursor-pointer"
                >
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {slotError && <p className="text-[11px] font-medium text-destructive">{slotError}</p>}
        </div>
      </div>
    </div>
  );
}

export default BookSessionModal;
