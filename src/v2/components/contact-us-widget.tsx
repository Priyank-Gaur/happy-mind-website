import { useEffect, useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { CircleCheck, ChevronDown, LoaderCircle, Phone, X } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/v2/lib/utils";
import { contactQueries, QUERY_REASONS, REACHOUT_SLOTS } from "@/v2/lib/contact-queries";
import { submitContact } from "@/v2/lib/website-api";

type Errors = Partial<Record<"firstName" | "lastName" | "mobile" | "queryFor" | "slot", string>>;

/**
 * Floating "Contact Us" call button + modal form, mounted once in __root so it
 * is available on every page of the site.
 */
export function ContactUsWidget() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Contact us"
        /* Sits above the mobile bottom nav (fixed inset-x-4 bottom-4) on small screens. */
        className="group fixed bottom-24 right-4 z-50 grid h-14 w-14 place-items-center rounded-full bg-primary text-white shadow-glow ring-4 ring-primary/15 transition-transform duration-200 hover:scale-105 active:scale-95 md:bottom-6 md:right-6 md:h-16 md:w-16"
      >
        <span className="absolute inset-0 rounded-full bg-primary/40 opacity-0 transition group-hover:animate-ping group-hover:opacity-100" />
        <Phone className="relative h-6 w-6 md:h-7 md:w-7" strokeWidth={2} />
      </button>

      <ContactUsDialog open={open} onOpenChange={setOpen} />
    </>
  );
}

export function ContactUsDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [mobile, setMobile] = useState("");
  const [queryFor, setQueryFor] = useState("");
  const [message, setMessage] = useState("");
  const [slot, setSlot] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Reset the form each time the modal opens.
  useEffect(() => {
    if (open) {
      setFirstName("");
      setLastName("");
      setMobile("");
      setQueryFor("");
      setMessage("");
      setSlot("");
      setErrors({});
      setSubmitting(false);
      setSuccess(false);
    }
  }, [open]);

  const validate = (): Errors => {
    const next: Errors = {};
    if (!firstName.trim()) next.firstName = "Please enter your first name.";
    if (!lastName.trim()) next.lastName = "Please enter your last name.";
    const digits = mobile.replace(/\D/g, "");
    if (!mobile.trim()) next.mobile = "Please enter your mobile number.";
    else if (digits.length < 10 || digits.length > 15) next.mobile = "Enter a valid mobile number.";
    if (!queryFor) next.queryFor = "Please select a reason.";
    if (!slot) next.slot = "Please select a preferred slot.";
    return next;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setSubmitting(true);
    try {
      contactQueries.add({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        mobile: mobile.trim(),
        queryFor,
        message: message.trim() || undefined,
        slot,
      });

      const res = await submitContact({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        phone_number: mobile.trim(),
        reason: queryFor,
        message: message.trim() || undefined,
      });

      toast.success(res?.message || "Thanks! We'll get in touch shortly.");
      setSuccess(true);
    } catch (err: any) {
      toast.error(err?.message || "Failed to submit contact request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content aria-describedby={undefined} className="fixed left-1/2 top-1/2 z-50 max-h-[92vh] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl bg-white p-6 shadow-card duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:p-7">
          <div className="flex items-start justify-between gap-4">
            <DialogPrimitive.Title className="text-[28px] font-extrabold leading-none tracking-tight text-neutral-900">
              Contact Us
            </DialogPrimitive.Title>
            <DialogPrimitive.Close
              aria-label="Close"
              className="-mr-1 -mt-1 rounded-md p-1 text-neutral-900 transition hover:opacity-70 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
            >
              <X className="h-6 w-6" strokeWidth={2.5} />
            </DialogPrimitive.Close>
          </div>

          {success ? (
            <div className="flex flex-col items-center gap-4 py-10 text-center">
              <div className="grid h-16 w-16 place-items-center rounded-full bg-primary text-white">
                <CircleCheck className="h-8 w-8" strokeWidth={2} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-neutral-900">
                  Thanks {firstName || "there"}, we've got your details!
                </h3>
                <p className="mt-1.5 text-sm text-neutral-600">
                  Our team will reach out to you on{" "}
                  <span className="font-semibold text-neutral-900">{mobile}</span> during your
                  preferred slot ({slot}).
                </p>
              </div>
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="mt-2 h-12 rounded-lg bg-primary px-10 text-[15px] font-semibold text-white transition hover:opacity-90"
              >
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-5 space-y-4" noValidate>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="cu-first">First Name*</Label>
                  <input
                    id="cu-first"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Your Name"
                    className={fieldCls(errors.firstName)}
                  />
                  {errors.firstName && <ErrorText>{errors.firstName}</ErrorText>}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="cu-last">Last Name*</Label>
                  <input
                    id="cu-last"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Your Surname"
                    className={fieldCls(errors.lastName)}
                  />
                  {errors.lastName && <ErrorText>{errors.lastName}</ErrorText>}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="cu-mobile">Mobile Number*</Label>
                <input
                  id="cu-mobile"
                  type="tel"
                  inputMode="tel"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="XXXXXXXXXX"
                  className={fieldCls(errors.mobile)}
                />
                {errors.mobile && <ErrorText>{errors.mobile}</ErrorText>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="cu-query">Query For*</Label>
                <SelectField
                  id="cu-query"
                  value={queryFor}
                  onChange={(v) => {
                    setQueryFor(v);
                    setErrors((prev) => ({ ...prev, queryFor: undefined }));
                  }}
                  placeholder="Select a reason"
                  options={QUERY_REASONS}
                  error={errors.queryFor}
                />
                {errors.queryFor && <ErrorText>{errors.queryFor}</ErrorText>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="cu-message">Enter Message</Label>
                <textarea
                  id="cu-message"
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Your message here..."
                  className={cn(fieldCls(), "h-auto py-3 leading-relaxed")}
                />
              </div>

              <div className="space-y-1.5 pt-1">
                <Label htmlFor="cu-slot">Select Preferred Reachout Slot*</Label>
                <SelectField
                  id="cu-slot"
                  value={slot}
                  onChange={(v) => {
                    setSlot(v);
                    setErrors((prev) => ({ ...prev, slot: undefined }));
                  }}
                  placeholder="Select an option"
                  options={REACHOUT_SLOTS}
                  error={errors.slot}
                />
                {errors.slot && <ErrorText>{errors.slot}</ErrorText>}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-primary text-[15px] font-semibold text-white transition hover:opacity-90 disabled:opacity-70"
              >
                {submitting ? (
                  <>
                    <LoaderCircle className="h-4 w-4 animate-spin" /> Submitting…
                  </>
                ) : (
                  "Submit"
                )}
              </button>
            </form>
          )}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

function fieldCls(error?: string) {
  return cn(
    "w-full rounded-lg border border-neutral-300 bg-white px-3.5 py-2.5 text-[15px] text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-primary focus:ring-2 focus:ring-primary/25",
    error && "border-destructive focus:border-destructive focus:ring-destructive/25",
  );
}

function Label({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="block text-[15px] font-semibold text-neutral-900">
      {children}
    </label>
  );
}

function ErrorText({ children }: { children: React.ReactNode }) {
  return <p className="text-xs font-medium text-destructive">{children}</p>;
}

/** Native select so the option list renders as the platform dropdown. */
function SelectField({
  id,
  value,
  onChange,
  placeholder,
  options,
  error,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  options: string[];
  error?: string;
}) {
  return (
    <div className="relative">
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          fieldCls(error),
          "cursor-pointer appearance-none pr-10",
          !value && "text-neutral-900",
        )}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-500" />
    </div>
  );
}
