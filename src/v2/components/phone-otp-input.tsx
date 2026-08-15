/**
 * Reusable phone + OTP input components.
 * Used by both /login (OTP tab) and /signup (phone-verify step).
 */

import { useEffect, useRef, useState } from "react";
import { Phone, LoaderCircle, RotateCcw } from "lucide-react";
import { Button } from "@/v2/components/ui/button";
import { Input } from "@/v2/components/ui/input";
import { cn } from "@/v2/lib/utils";

const OTP_LENGTH = 6;
const RESEND_SECONDS = 30;

// ---------------------------------------------------------------------------
// PhoneField — country code prefix + mobile number input
// ---------------------------------------------------------------------------

export function PhoneField({
  mobile,
  onChange,
  disabled,
  label = "Mobile Number",
  id = "mobile",
}: {
  mobile: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  label?: string;
  id?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-foreground/80">
        {label}
      </label>
      <div className="flex gap-2">
        {/* Country code badge */}
        <div className="flex h-12 shrink-0 items-center gap-1.5 rounded-2xl border-0 bg-lavender/40 px-3.5 text-sm font-bold text-lavender-deep shadow-soft select-none">
          <Phone className="h-3.5 w-3.5" />
          +91
        </div>
        <Input
          id={id}
          type="tel"
          inputMode="numeric"
          autoComplete="tel-national"
          maxLength={10}
          placeholder="10-digit mobile number"
          value={mobile}
          onChange={(e) => onChange(e.target.value.replace(/\D/g, "").slice(0, 10))}
          disabled={disabled}
          className="h-12 flex-1 rounded-2xl border-0 bg-white/90 shadow-soft placeholder:text-muted-foreground/70 focus-visible:ring-2 focus-visible:ring-lavender-deep/30"
        />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// OtpBoxes — 6 individual digit inputs with auto-focus & paste handling
// ---------------------------------------------------------------------------

export function OtpBoxes({
  value,
  onChange,
  disabled,
}: {
  value: string;
  onChange: (otp: string) => void;
  disabled?: boolean;
}) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const digits = Array.from({ length: OTP_LENGTH }, (_, i) => value[i] ?? "");

  const focusBox = (index: number) => {
    refs.current[Math.max(0, Math.min(OTP_LENGTH - 1, index))]?.focus();
  };

  const handleChange = (index: number, val: string) => {
    const clean = val.replace(/\D/g, "");
    if (!clean) {
      const arr = digits.slice();
      arr[index] = "";
      onChange(arr.join(""));
      return;
    }

    const arr = digits.slice();
    for (let i = 0; i < clean.length && index + i < OTP_LENGTH; i++) {
      arr[index + i] = clean[i];
    }
    onChange(arr.join("").slice(0, OTP_LENGTH));
    focusBox(index + clean.length);
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[index]) {
      e.preventDefault();
      focusBox(index - 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      focusBox(index - 1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      focusBox(index + 1);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (!pasted) return;
    onChange(pasted);
    focusBox(pasted.length);
  };

  return (
    <div className="flex justify-between gap-2">
      {digits.map((d, i) => (
        <input
          key={i}
          ref={(el) => { refs.current[i] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={OTP_LENGTH}
          value={d}
          disabled={disabled}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          onFocus={(e) => e.target.select()}
          aria-label={`OTP Digit ${i + 1}`}
          className={cn(
            "h-12 w-12 rounded-2xl border border-border/50 bg-white/90 text-center text-lg font-bold shadow-soft transition",
            "focus:border-lavender-deep focus:outline-none focus:ring-2 focus:ring-lavender-deep/30",
            d ? "border-lavender-deep bg-lavender/20 text-lavender-deep" : "text-foreground",
            disabled && "opacity-50 cursor-not-allowed",
          )}
        />
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// ResendTimer — countdown timer + resend button
// ---------------------------------------------------------------------------

export function ResendTimer({
  onResend,
  resending,
  seconds: initialSeconds = RESEND_SECONDS,
}: {
  onResend: () => void;
  resending?: boolean;
  seconds?: number;
}) {
  const [remaining, setRemaining] = useState(initialSeconds);

  useEffect(() => {
    setRemaining(initialSeconds);
    const timer = setInterval(() => {
      setRemaining((s) => {
        if (s <= 1) {
          clearInterval(timer);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [initialSeconds]);

  if (remaining > 0) {
    return (
      <p className="text-center text-xs text-muted-foreground">
        Didn't receive the code? Resend in{" "}
        <span className="font-semibold text-foreground">
          {remaining}s
        </span>
      </p>
    );
  }

  return (
    <Button
      type="button"
      variant="ghost"
      disabled={resending}
      onClick={() => {
        setRemaining(initialSeconds);
        onResend();
      }}
      className="mx-auto flex h-auto p-0 text-xs font-semibold text-lavender-deep hover:bg-transparent hover:underline disabled:opacity-50"
    >
      {resending ? (
        <><LoaderCircle className="mr-1.5 h-3.5 w-3.5 animate-spin" /> Sending…</>
      ) : (
        <><RotateCcw className="mr-1.5 h-3.5 w-3.5" /> Resend OTP</>
      )}
    </Button>
  );
}
