import { useEffect, useMemo, useState } from "react";
import { format, isSameDay } from "date-fns";
import { useV2Navigate } from "@/v2/lib/router";
import { Calendar as CalendarIcon, Clock, CircleCheck, LoaderCircle, Sparkles, ArrowRight, UserCheck } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/v2/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/v2/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/v2/components/ui/select";
import { Calendar } from "@/v2/components/ui/calendar";
import { Button } from "@/v2/components/ui/button";
import { cn } from "@/v2/lib/utils";
import {
  TIME_SLOTS,
  savePendingBooking,
  getPendingBooking,
  markBookingResume,
  clearPendingBooking,
  bookings,
  type PreferredSlot,
  type BookingPayload,
} from "@/v2/lib/bookings";
import { useUserProfile } from "@/v2/hooks/use-user-profile";
import { type Psychologist } from "@/v2/data/psychologists";
import { payForHappiTalk, payForHappiGuide } from "@/v2/lib/website-api";
import { cart } from "@/v2/lib/cart-store";
import { auth } from "@/v2/lib/auth";
import { checkAuthOrRedirect } from "@/v2/lib/auth-guard";
import { toast } from "sonner";

export type BookServiceContext = {
  key: string;
  name: string;
  /** Optional label description for the service dropdown */
  label?: string;
  plan?: {
    id?: string;
    name?: string;
    price?: number;
    billing?: string;
  } | null;
  initialPsychologist?: Psychologist | null;
  initialStep?: "form" | "confirmed";
  initialSlots?: {
    slot1: PreferredSlot;
    slot2: PreferredSlot;
  } | null;
};

export const SERVICE_OPTIONS: BookServiceContext[] = [
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

type FlowStep = "form" | "confirmed";

type SlotErrors = {
  date1?: string;
  slot1?: string;
  date2?: string;
  slot2?: string;
};

export function BookSessionDialog({
  open,
  onOpenChange,
  service,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service: BookServiceContext | null;
}) {
  const navigate = useV2Navigate();
  const { profile, loading: profileLoading } = useUserProfile();

  // Default to SOLV first unless explicitly opened for HappiTALK
  const [selectedServiceKey, setSelectedServiceKey] = useState<string>(
    service?.key?.toLowerCase() === "happitalk" ? "happitalk" : "solv"
  );

  const [step, setStep] = useState<FlowStep>(service?.initialStep || "form");

  // Slots state (Required: Slot 1 and Slot 2)
  const [date1, setDate1] = useState<Date | undefined>(
    service?.initialSlots?.slot1?.date
  );
  const [slot1, setSlot1] = useState<string>(
    service?.initialSlots?.slot1?.slot || ""
  );
  const [date2, setDate2] = useState<Date | undefined>(
    service?.initialSlots?.slot2?.date
  );
  const [slot2, setSlot2] = useState<string>(
    service?.initialSlots?.slot2?.slot || ""
  );
  const [slotErrors, setSlotErrors] = useState<SlotErrors>({});

  // Selected psychologist (for HappiTalk when coming from /experts)
  const [selectedPsychologist, setSelectedPsychologist] = useState<Psychologist | null>(
    service?.initialPsychologist || null
  );

  // Payment & submit state
  const [submittingPayment, setSubmittingPayment] = useState(false);
  const [paymentResult, setPaymentResult] = useState<{ transactionId?: string } | null>(null);

  // Reset/sync dialog state whenever opened
  useEffect(() => {
    if (open) {
      setStep(service?.initialStep || "form");
      const pending = getPendingBooking();
      setDate1(service?.initialSlots?.slot1?.date || pending?.slot1?.date || undefined);
      setSlot1(service?.initialSlots?.slot1?.slot || pending?.slot1?.slot || "");
      setDate2(service?.initialSlots?.slot2?.date || pending?.slot2?.date || undefined);
      setSlot2(service?.initialSlots?.slot2?.slot || pending?.slot2?.slot || "");
      setSlotErrors({});
      setSubmittingPayment(false);
      setPaymentResult(null);
      setSelectedServiceKey(
        service?.key?.toLowerCase() === "happitalk" || pending?.serviceKey?.toLowerCase() === "happitalk" ? "happitalk" : "solv"
      );
      setSelectedPsychologist(service?.initialPsychologist || null);
    }
  }, [open, service]);

  const isHappiTalk = selectedServiceKey === "happitalk";
  const activeService = useMemo(() => {
    return (
      SERVICE_OPTIONS.find((s) => s.key === selectedServiceKey) || {
        key: selectedServiceKey,
        name: isHappiTalk ? "HappiTALK" : "SOLV",
      }
    );
  }, [selectedServiceKey, isHappiTalk]);

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

    // Save the visitor's chosen slots BEFORE any auth handoff, so the same
    // form continues (pre-filled) once they come back from login.
    savePendingBooking({
      serviceKey: selectedServiceKey,
      serviceName: activeService.name,
      slot1: slot1Data,
      slot2: slot2Data,
      plan: service?.plan || null,
    });

    if (!checkAuthOrRedirect(navigate, typeof window !== "undefined" ? window.location.pathname : "/", "Please log in to book a session.")) {
      markBookingResume();
      onOpenChange(false);
      return;
    }

    if (isHappiTalk && !selectedPsychologist) {
      // Slots are already saved above — redirect to /experts page to pick psychologist
      onOpenChange(false);
      toast.info("Preferred slots saved! Select your psychologist below to complete booking.");
      navigate({ to: "/experts" });
      return;
    }

    // Direct API hit & payment order generation (SOLV via payForHappiGuide or HappiTALK via payForHappiTalk)
    setSubmittingPayment(true);
    const token = auth.get()?.token;
    const formattedDate = format(date1, "yyyy-MM-dd");
    const slotTimeStr = slot1; // e.g. "10:00 AM - 11:00 AM"

    try {
      let res: { link: string } | null = null;

      if (isHappiTalk && selectedPsychologist) {
        const planId = Number(service?.plan?.id ?? 21);
        const amount = Number(service?.plan?.price ?? selectedPsychologist.startingFrom ?? 800);

        res = await payForHappiTalk(
          {
            psychologist_id: Number(selectedPsychologist.id),
            plan_id: planId,
            amount,
            date: formattedDate,
            time: slotTimeStr,
            session: 1,
            user_recording_permission: 1,
            coupen_id: 0,
          },
          token,
        );
      } else {
        // SOLV -> HappiGuide payment
        const planId = Number(service?.plan?.id ?? 8);
        const amount = Number(service?.plan?.price ?? 599);

        res = await payForHappiGuide(
          {
            plan_id: planId,
            amount,
            date: formattedDate,
            time: slotTimeStr,
            coupen_id: 0,
          },
          token,
        );
      }

      console.log("🌐 [Website API] Payment Link Response:", res);

      if (res?.link) {
        toast.success("Redirecting to secure payment gateway…");
        window.location.href = res.link;
        return;
      } else {
        toast.success(`Booking Confirmed for ${activeService.name}!`);
      }
    } catch (err: any) {
      console.warn("Direct booking API notice:", err);
      toast.error(err?.message ?? `Failed to initiate booking for ${activeService.name}`);
    }

    bookings.add({
      service: activeService.name,
      serviceKey: selectedServiceKey,
      name: profile.name,
      email: profile.email,
      phone: profile.phone,
      date: formattedDate,
      slot: slot1,
      date2: format(date2, "yyyy-MM-dd"),
      slot2: slot2,
    });

    const orderId = "HM-" + Math.random().toString(36).slice(2, 8).toUpperCase();
    const purchased = `${activeService.name} Session (${formattedDate} @ ${slot1})`;
    const plan = activeService.name;

    cart.clear();
    clearPendingBooking();
    setSubmittingPayment(false);
    onOpenChange(false);
    navigate({
      to: "/checkout/success",
      search: { orderId, purchased, plan },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] gap-0 overflow-y-auto rounded-3xl border-0 bg-white p-0 shadow-card sm:max-w-xl">
        {/* Branded Dialog Header */}
        <div className="relative overflow-hidden rounded-t-3xl bg-gradient-hero px-6 py-5">
          <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-white/40 blur-2xl" />
          <DialogHeader className="relative space-y-1 text-left">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-lavender-deep">
                <Sparkles className="h-3.5 w-3.5" /> {activeService.name}
              </span>
            </div>
            <DialogTitle className="text-2xl font-bold tracking-tight text-foreground">
              {step === "form" ? "Book a Session" : "Booking Confirmed!"}
            </DialogTitle>
            <DialogDescription className="text-sm text-foreground/70">
              {step === "form"
                ? `Reserve a 1:1 ${activeService.name} session. Select 2 preferred date and time slots.`
                : "Your session request and payment confirmation are complete."}
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-6">
          {/* USER PROFILE INFO BANNER (Fetched automatically from Profile API) */}
          {step === "form" && (
            <div className="mb-5 rounded-2xl border border-lavender/30 bg-lavender/10 p-3.5 shadow-soft">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-brand text-xs font-bold text-white shadow-glow">
                    {profile.name ? profile.name.slice(0, 2).toUpperCase() : "U"}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                      <span>{profileLoading ? "Loading Profile..." : profile.name}</span>
                      <CircleCheck className="h-3.5 w-3.5 text-emerald-600" />
                    </div>
                    <div className="text-[11px] text-muted-foreground">
                      {profile.email} {profile.phone ? `• ${profile.phone}` : ""}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SINGLE STEP BOOKING FORM */}
          {step === "form" && (
            <div className="space-y-5">
              {/* Service Selection Dropdown (Defaults to SOLV first) */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-foreground/80">
                  Service
                </label>
                <Select
                  value={selectedServiceKey}
                  onValueChange={(v) => {
                    setSelectedServiceKey(v);
                    setSlotErrors({});
                  }}
                >
                  <SelectTrigger className="h-11 w-full rounded-2xl border-0 bg-white px-4 font-medium shadow-soft">
                    <span className="flex items-center gap-2 truncate">
                      <Sparkles className="h-4 w-4 shrink-0 text-lavender-deep" />
                      <SelectValue placeholder="Select Service" />
                    </span>
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl">
                    {SERVICE_OPTIONS.map((s) => (
                      <SelectItem key={s.key} value={s.key} className="rounded-xl font-medium">
                        {s.label ?? s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Psychologist info pill if pre-selected for HappiTALK */}
              {isHappiTalk && selectedPsychologist && (
                <div className="flex items-center justify-between rounded-2xl border border-lavender-deep/40 bg-lavender/15 p-3 text-xs">
                  <div className="flex items-center gap-2">
                    <UserCheck className="h-4 w-4 text-lavender-deep" />
                    <span className="font-semibold text-foreground">
                      Selected Psychologist: {selectedPsychologist.name}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-lavender-deep bg-white px-2 py-0.5 rounded-full shadow-soft">
                    {selectedPsychologist.designation}
                  </span>
                </div>
              )}

              <div className="rounded-2xl bg-amber-500/10 border border-amber-500/30 p-3 text-xs text-amber-900">
                <p className="font-semibold">Selection Requirement:</p>
                <p className="mt-0.5 text-[11px] text-amber-800">
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
                  onClick={() => onOpenChange(false)}
                  className="h-11 rounded-full px-6 text-sm font-semibold"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  disabled={submittingPayment}
                  onClick={handleBookNow}
                  className="h-11 rounded-full bg-gradient-brand px-8 text-sm font-semibold text-white shadow-glow hover:opacity-95 cursor-pointer"
                >
                  {submittingPayment ? (
                    <>
                      <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> Booking...
                    </>
                  ) : isHappiTalk && !selectedPsychologist ? (
                    <>
                      Next: Choose Psychologist <ArrowRight className="ml-1.5 h-4 w-4" />
                    </>
                  ) : (
                    <>
                      Book Now <ArrowRight className="ml-1.5 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* CONFIRMATION WINDOW */}
          {step === "confirmed" && (
            <div className="flex flex-col items-center gap-4 py-8 text-center">
              <div className="grid h-16 w-16 place-items-center rounded-full bg-gradient-brand text-white shadow-glow">
                <CircleCheck className="h-8 w-8" strokeWidth={2} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">
                  Booking Confirmed!
                </h3>
                <p className="mt-2 text-sm text-muted-foreground max-w-md leading-relaxed">
                  Thank you <span className="font-semibold text-foreground">{profile.name}</span>! Your 2 preferred date/time slots for <span className="font-semibold text-foreground">{activeService.name}</span>
                  {selectedPsychologist ? ` with ${selectedPsychologist.name}` : ""} have been successfully confirmed.
                </p>

                <div className="mt-4 rounded-2xl bg-lavender/15 p-4 text-left space-y-2 text-xs">
                  <div className="font-bold text-lavender-deep">Session Summary:</div>
                  <div>
                    <span className="text-muted-foreground">Preferred Slot 1:</span>{" "}
                    <span className="font-medium text-foreground">
                      {date1 ? format(date1, "EEEE, d MMMM yyyy") : ""} — {slot1}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Preferred Slot 2:</span>{" "}
                    <span className="font-medium text-foreground">
                      {date2 ? format(date2, "EEEE, d MMMM yyyy") : ""} — {slot2}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">User Email:</span>{" "}
                    <span className="font-medium text-foreground">{profile.email}</span>
                  </div>
                </div>

                {paymentResult?.transactionId && (
                  <p className="mt-3 text-xs font-mono bg-lavender/20 px-3 py-1 rounded-full inline-block text-lavender-deep">
                    Transaction ID: {paymentResult.transactionId}
                  </p>
                )}
              </div>
              <Button
                onClick={() => onOpenChange(false)}
                className="mt-2 h-11 rounded-full bg-gradient-brand px-8 text-sm font-semibold text-white shadow-glow hover:opacity-95"
              >
                Done
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

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
    <div className="space-y-2 rounded-2xl bg-lavender/15 p-3.5">
      <p className="text-xs font-bold uppercase tracking-wider text-lavender-deep">
        {title} <span className="text-rose-500">*</span>
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
                  "flex h-10 w-full items-center gap-2 rounded-2xl bg-white px-3.5 text-left text-xs shadow-soft transition hover:bg-white/90 cursor-pointer",
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
            <PopoverContent className="w-auto rounded-2xl p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(d) => {
                  onDateChange(d);
                  setPickerOpen(false);
                }}
                disabled={{ before: minDate }}
                autoFocus
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
                "h-10 w-full rounded-2xl border-0 bg-white px-3.5 text-xs shadow-soft data-[placeholder]:text-muted-foreground cursor-pointer",
                slotError ? "ring-2 ring-destructive/50" : ""
              )}
            >
              <span className="flex items-center gap-2 truncate">
                <Clock className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                <SelectValue placeholder="Select time slot" />
              </span>
            </SelectTrigger>
            <SelectContent className="max-h-60 rounded-2xl">
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
