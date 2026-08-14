import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { format } from "date-fns";
import {
  X,
  CalendarIcon,
  Clock,
  ArrowRight,
  Loader2,
  CheckCircle,
  AlertCircle,
  BadgeCheck,
  Sparkles,
  LogIn,
  ChevronDown,
} from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
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
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  fetchCurrentUser,
  redirectToLogin,
  type AuthState,
} from "@/lib/happimyndAuth";

const SERVICES = [
  { value: "solv", label: "SOLV (One-on-one growth conversations)" },
  { value: "happitalk", label: "HappiTALK (Therapeutic Counselling)" },
] as const;

type ServiceValue = (typeof SERVICES)[number]["value"];

/* Hour-long slots starting every half hour, right around the clock:
   12:00 AM - 1:00 AM, 12:30 AM - 1:30 AM, … 11:30 PM - 12:30 AM */
const clockLabel = (minutesFromMidnight: number) => {
  const total = minutesFromMidnight % (24 * 60);
  const hour24 = Math.floor(total / 60);
  const minute = total % 60;
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
  return `${hour12}:${String(minute).padStart(2, "0")} ${
    hour24 < 12 ? "AM" : "PM"
  }`;
};

const TIME_SLOTS = Array.from({ length: 48 }, (_, index) => {
  const startMinutes = index * 30;
  return {
    startMinutes,
    label: `${clockLabel(startMinutes)} - ${clockLabel(startMinutes + 60)}`,
  };
});

const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

type SubmitStatus = "idle" | "loading" | "success" | "error";

interface Slot {
  date?: Date;
  time: string;
}

const startOfToday = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

const initials = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase() || "?";

const BookSessionModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [services, setServices] = useState<ServiceValue[]>([SERVICES[0].value]);
  const [slot1, setSlot1] = useState<Slot>({ time: "" });
  const [slot2, setSlot2] = useState<Slot>({ time: "" });
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [auth, setAuth] = useState<AuthState>({ status: "checking" });
  const [now, setNow] = useState(() => new Date());
  /* Fields the visitor has typed into: profile data never overwrites these. */
  const edited = useRef<Set<"name" | "email" | "phone">>(new Set());

  // Keep the clock current while the modal is open, so today's past slots
  // drop away on their own rather than at the moment of submission.
  useEffect(() => {
    if (!isOpen) return;

    setNow(new Date());
    const tick = window.setInterval(() => setNow(new Date()), 60_000);
    return () => window.clearInterval(tick);
  }, [isOpen]);

  // Ask who the visitor is each time the modal opens, so a session that
  // expired while the tab sat idle is caught before they fill anything in.
  useEffect(() => {
    if (!isOpen) return;

    const controller = new AbortController();
    setAuth({ status: "checking" });

    fetchCurrentUser(controller.signal).then((state) => {
      if (controller.signal.aborted) return;
      setAuth(state);

      if (state.status === "authenticated") {
        // Fill only what the visitor hasn't touched and hasn't got already.
        setName((current) =>
          edited.current.has("name") || current ? current : state.user.name,
        );
        setEmail((current) =>
          edited.current.has("email") || current ? current : state.user.email,
        );
        setPhone((current) =>
          edited.current.has("phone") || current ? current : state.user.phone,
        );
      }
    });

    return () => controller.abort();
  }, [isOpen]);

  // Signed out is a dead end here — hand them to the platform login page,
  // remembering to come back. Never redirect when auth is merely unavailable.
  useEffect(() => {
    if (!isOpen || auth.status !== "unauthenticated") return;

    const timer = window.setTimeout(redirectToLogin, 900);
    return () => window.clearTimeout(timer);
  }, [isOpen, auth.status]);

  // Hold the page still behind the modal, and close on Escape
  useEffect(() => {
    if (!isOpen) return;

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, onClose]);

  const reset = () => {
    setName("");
    setEmail("");
    setPhone("");
    setServices([SERVICES[0].value]);
    setSlot1({ time: "" });
    setSlot2({ time: "" });
    setStatus("idle");
    setErrorMessage("");
    edited.current.clear();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const describeSlot = (slot: Slot) =>
    slot.date ? `${format(slot.date, "d MMM yyyy")}, ${slot.time}` : "";

  const selectedLabels = SERVICES.filter((s) =>
    services.includes(s.value),
  ).map((s) => s.label);

  const toggleService = (value: ServiceValue, checked: boolean) =>
    setServices((current) =>
      checked
        ? [...current, value]
        : current.filter((entry) => entry !== value),
    );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (services.length === 0) {
      setErrorMessage("Please choose at least one service.");
      setStatus("error");
      return;
    }

    if (!slot1.date || !slot1.time || !slot2.date || !slot2.time) {
      setErrorMessage("Please pick a date and time for both preferred slots.");
      setStatus("error");
      return;
    }

    setStatus("loading");
    setErrorMessage("");

    const [firstName, ...rest] = name.trim().split(/\s+/);

    const payload = {
      first_name: firstName,
      last_name: rest.join(" ") || firstName,
      phone_number: phone,
      // The endpoint takes a single reason; the message below carries the
      // full selection when both services are requested.
      reason: services.includes("solv")
        ? "solv_session_request"
        : "counselling_support",
      message: [
        `Session booking request — ${selectedLabels.join(" + ")}`,
        `Email: ${email}`,
        `Preferred slot 1: ${describeSlot(slot1)}`,
        `Preferred slot 2: ${describeSlot(slot2)}`,
      ].join("\n"),
      referral: describeSlot(slot1),
    };

    try {
      // Laravel session + CSRF cookie, same handshake the contact form uses
      const handshake = await fetch("/sanctum/csrf-cookie", {
        credentials: "include",
      });

      const xsrfToken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("XSRF-TOKEN="))
        ?.split("=")[1];

      if (!xsrfToken) {
        // HTML back from this route means it never reached the backend — the
        // dev server (or a misrouted deploy) answered with the SPA shell.
        const servedHtml = (handshake.headers.get("content-type") ?? "").includes(
          "text/html",
        );
        throw new Error(
          servedHtml
            ? "Booking service is unreachable from this environment, so the request wasn't sent. Please try again from happimynd.com."
            : "Could not start a secure session. Please refresh and try again.",
        );
      }

      const response = await fetch("/submit-contact", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-XSRF-TOKEN": decodeURIComponent(xsrfToken),
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        let errMsg = `Server error (${response.status})`;
        try {
          const errData = await response.json();
          if (errData?.message || errData?.error) {
            errMsg = errData.message ?? errData.error;
          }
        } catch {
          // ignore JSON parse errors for error body
        }
        throw new Error(errMsg);
      }

      setStatus("success");
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
      setStatus("error");
    }
  };

  if (!isOpen) return null;

  const incomplete = !name.trim() || !email.trim() || !phone.trim();

  /* Today only offers slots that haven't started yet; any other day is open.
     `now` ticks each minute, so a slot disappears as the clock passes it. */
  const availableSlots = (date?: Date) => {
    if (!date || !isSameDay(date, now)) return TIME_SLOTS;
    const minutesNow = now.getHours() * 60 + now.getMinutes();
    return TIME_SLOTS.filter((slot) => slot.startMinutes > minutesNow);
  };

  const fieldPill =
    "flex h-12 w-full items-center gap-2 rounded-full border border-border bg-white px-4 text-left text-sm text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-60";

  const renderSlot = (
    label: string,
    slot: Slot,
    setSlot: (s: Slot) => void,
  ) => (
    <div className="rounded-2xl bg-muted/40 p-4 sm:p-5">
      <p className="mb-4 text-xs font-bold uppercase tracking-wide text-primary">
        {label} <span className="text-destructive">*</span>
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">
            Preferred Date
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <button type="button" className={fieldPill}>
                <CalendarIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span className={slot.date ? "" : "text-muted-foreground"}>
                  {slot.date ? format(slot.date, "d MMM yyyy") : "Select date"}
                </span>
              </button>
            </PopoverTrigger>
            {/* z above the modal: popovers portal to <body> as siblings of it */}
            <PopoverContent className="z-[300] w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={slot.date}
                onSelect={(date) => {
                  // Dropping to an earlier day can strip a now-past slot
                  const stillValid =
                    !date ||
                    !slot.time ||
                    availableSlots(date).some((s) => s.label === slot.time);
                  setSlot({ date, time: stillValid ? slot.time : "" });
                }}
                disabled={(date) => date < startOfToday()}
                fromDate={startOfToday()}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">
            Time Slot
          </label>
          <Select
            value={slot.time}
            onValueChange={(time) => setSlot({ ...slot, time })}
          >
            <SelectTrigger className={fieldPill}>
              <Clock className="h-4 w-4 shrink-0 text-muted-foreground" />
              <SelectValue placeholder="Select time slot" />
            </SelectTrigger>
            <SelectContent className="z-[300] max-h-72">
              {availableSlots(slot.date).map((time) => (
                <SelectItem key={time.startMinutes} value={time.label}>
                  {time.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );

  /* Rendered into <body>: the navbar's backdrop-blur would otherwise become the
     containing block for this fixed overlay and pin it to the navbar's box. */
  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Column layout: header and actions stay put, only the fields scroll */}
      <div className="relative z-10 flex max-h-[calc(100dvh-2rem)] w-full max-w-3xl flex-col overflow-hidden rounded-3xl bg-card shadow-2xl sm:max-h-[calc(100dvh-3rem)]">
        {/* Header */}
        <div className="relative shrink-0 bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5 px-6 py-5 sm:px-8 sm:py-6">
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close"
            className="absolute right-5 top-5 text-muted-foreground transition-colors hover:text-foreground"
          >
            <X className="h-6 w-6" />
          </button>

          <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-1.5 shadow-sm">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold tracking-wide text-primary">
              SOLV
            </span>
          </span>

          <h2 className="mt-3 font-sans text-2xl font-bold text-foreground sm:text-3xl">
            Book a Session
          </h2>
          <p className="mt-1.5 text-sm text-muted-foreground sm:text-base">
            Reserve a 1:1 SOLV session. Select 2 preferred date and time slots.
          </p>
        </div>

        {auth.status === "checking" ? (
          <div className="flex flex-col items-center gap-3 px-6 py-16 text-center sm:px-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">
              Checking your HappiMynd account…
            </p>
          </div>
        ) : auth.status === "unauthenticated" ? (
          <div className="flex flex-col items-center gap-3 px-6 py-16 text-center sm:px-8">
            <LogIn className="h-8 w-8 text-primary" />
            <p className="text-lg font-semibold text-foreground">
              Please sign in to book
            </p>
            <p className="max-w-sm text-sm text-muted-foreground">
              Taking you to the HappiMynd login page. You'll come straight back
              here to finish booking.
            </p>
            <button
              type="button"
              onClick={redirectToLogin}
              className="mt-2 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Continue to login
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        ) : status === "success" ? (
          <div className="flex flex-col items-center gap-3 overflow-y-auto px-6 py-12 text-center sm:px-8">
            <CheckCircle className="h-12 w-12 text-green-500" />
            <p className="text-lg font-semibold text-foreground">
              Session request sent!
            </p>
            <p className="max-w-sm text-sm text-muted-foreground">
              We've received your preferred slots and will confirm your session
              over a call shortly.
            </p>
            <button
              type="button"
              onClick={handleClose}
              className="mt-2 rounded-full bg-primary px-6 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Close
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex min-h-0 flex-1 flex-col"
          >
            <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-6 py-6 sm:px-8">
            {/* Your details */}
            <div className="rounded-2xl border border-border bg-muted/20 p-4 sm:p-5">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                  {initials(name)}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="truncate font-semibold text-foreground">
                      {name.trim() || "Your details"}
                    </p>
                    {auth.status === "authenticated" && (
                      <BadgeCheck className="h-4 w-4 shrink-0 text-green-500" />
                    )}
                  </div>
                  {auth.status === "authenticated" && (email || phone) && (
                    <p className="truncate text-sm text-muted-foreground">
                      {[email, phone].filter(Boolean).join(" • ")}
                    </p>
                  )}
                </div>
              </div>

              {/* Prefilled from the profile where available, editable either
                  way so gaps can be completed without leaving the flow. */}
              {auth.status === "authenticated" && incomplete && (
                <p className="mb-3 text-sm text-muted-foreground">
                  Your profile is missing some details — please complete them
                  below.
                </p>
              )}

              <div className="grid gap-3 sm:grid-cols-3">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    edited.current.add("name");
                    setName(e.target.value);
                  }}
                  required
                  disabled={status === "loading"}
                  placeholder="Full name"
                  aria-label="Full name"
                  className={fieldPill}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    edited.current.add("email");
                    setEmail(e.target.value);
                  }}
                  required
                  disabled={status === "loading"}
                  placeholder="Email address"
                  aria-label="Email address"
                  className={fieldPill}
                />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => {
                    edited.current.add("phone");
                    setPhone(e.target.value);
                  }}
                  required
                  disabled={status === "loading"}
                  placeholder="Phone number"
                  aria-label="Phone number"
                  className={fieldPill}
                />
              </div>
            </div>

            {/* Service */}
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                Service
              </label>
              {/* Multi-select: a booking may request both services at once */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    disabled={status === "loading"}
                    className={`${fieldPill} h-14 justify-between border-primary text-base`}
                  >
                    <span className="flex min-w-0 items-center gap-2">
                      <Sparkles className="h-4 w-4 shrink-0 text-primary" />
                      <span
                        className={`truncate ${
                          selectedLabels.length ? "" : "text-muted-foreground"
                        }`}
                      >
                        {selectedLabels.length
                          ? selectedLabels.join(", ")
                          : "Select service"}
                      </span>
                    </span>
                    <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start"
                  className="z-[300] w-[var(--radix-dropdown-menu-trigger-width)]"
                >
                  {SERVICES.map((s) => (
                    <DropdownMenuCheckboxItem
                      key={s.value}
                      checked={services.includes(s.value)}
                      // Keep the menu open so both can be ticked in one go
                      onSelect={(e) => e.preventDefault()}
                      onCheckedChange={(checked) =>
                        toggleService(s.value, checked)
                      }
                    >
                      {s.label}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {services.length === 0 && (
                <p className="mt-2 text-sm text-destructive">
                  Please choose at least one service.
                </p>
              )}
            </div>

            {/* Requirement notice */}
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
              <p className="text-sm font-semibold text-amber-900">
                Selection Requirement:
              </p>
              <p className="mt-1 text-sm leading-relaxed text-amber-800">
                Please select <strong>2 preferred date/time slots</strong> for
                your session. These are two preferences for the same session.
              </p>
            </div>

            {renderSlot("Preferred Slot 1", slot1, setSlot1)}
            {renderSlot("Preferred Slot 2", slot2, setSlot2)}
            </div>

            {/* Action bar, always in view */}
            <div className="shrink-0 border-t border-border bg-card px-6 py-4 sm:px-8">
              {status === "error" && (
                <div className="mb-3 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-red-700">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <p className="text-sm leading-snug">{errorMessage}</p>
                </div>
              )}

              <div className="flex items-center justify-end gap-4">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground shadow-lg transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {status === "loading" ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Booking…
                    </>
                  ) : (
                    <>
                      Book Now
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>,
    document.body,
  );
};

export default BookSessionModal;
