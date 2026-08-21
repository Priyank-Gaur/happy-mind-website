import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/v2/components/ui/dialog";
import { Button } from "@/v2/components/ui/button";
import { Input } from "@/v2/components/ui/input";
import { LoaderCircle, Tag, CheckCircle, ArrowRight, Sparkles } from "lucide-react";
import { auth } from "@/v2/lib/auth";
import {
  applyCoupon,
  availFreeService,
  payForBundle,
} from "@/v2/lib/website-api";
import { toast } from "sonner";

type Step = "idle" | "validating" | "coupon-applied" | "processing" | "done" | "error";

export type CouponPurchaseDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  planId: number;
  planName: string;
  planPrice: number;
  onSuccess?: () => void;
};

export function CouponPurchaseDialog({
  open,
  onOpenChange,
  planId,
  planName,
  planPrice,
  onSuccess,
}: CouponPurchaseDialogProps) {
  const [step, setStep] = useState<Step>("idle");
  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponId, setCouponId] = useState<number | null>(null);
  const [finalAmount, setFinalAmount] = useState(planPrice);

  const reset = () => {
    setStep("idle");
    setCouponCode("");
    setCouponError("");
    setDiscount(0);
    setCouponId(null);
    setFinalAmount(planPrice);
  };

  const handleClose = (val: boolean) => {
    if (step === "processing" || step === "validating") return;
    onOpenChange(val);
    if (!val) setTimeout(reset, 200);
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    const token = auth.get()?.token;
    if (!token) {
      toast.error("Please log in to apply a coupon.");
      return;
    }

    setStep("validating");
    setCouponError("");

    try {
      const res = await applyCoupon({ plan_id: planId, coupon: couponCode.trim() }, token);

      if (res.status === "success" && res.data) {
        const d = res.data.discount;
        setDiscount(d);
        setCouponId(res.data.coupon_id);
        setFinalAmount(Math.round(planPrice * (1 - d / 100)));
        setStep("coupon-applied");
      } else {
        setCouponError(res.message || "Invalid coupon code.");
        setStep("idle");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Coupon validation failed.";
      setCouponError(msg);
      setStep("idle");
    }
  };

  const handlePay = async () => {
    const token = auth.get()?.token;
    if (!token) {
      toast.error("Please log in to purchase.");
      return;
    }

    setStep("processing");

    try {
      if (discount === 100) {
        // 100% discount — activate directly, skip Razorpay
        const res = await availFreeService(
          { plan_id: planId, coupen_id: couponId ?? undefined },
          token,
        );
        if (res.status === "success") {
          toast.success(`${planName} activated!`);
          setStep("done");
          onSuccess?.();
          setTimeout(() => handleClose(false), 1500);
        } else {
          throw new Error(res.message || "Activation failed.");
        }
      } else {
        // Partial or no discount — go to Razorpay
        const res = await payForBundle(
          {
            plan_id: planId,
            amount: finalAmount,
            coupen_id: couponId ?? 0,
          },
          token,
        );
        if (res?.link) {
          toast.success("Redirecting to secure payment gateway…");
          window.location.href = res.link;
        } else {
          throw new Error("No payment link received.");
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Payment failed. Please try again.";
      toast.error(msg);
      setStep(couponId ? "coupon-applied" : "idle");
    }
  };

  const handleSkipCoupon = () => {
    setDiscount(0);
    setCouponId(null);
    setFinalAmount(planPrice);
    setStep("processing");
    handlePay();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        {step === "done" ? (
          <div className="flex flex-col items-center gap-4 py-6 text-center">
            <div className="grid h-16 w-16 place-items-center rounded-full bg-emerald-100">
              <CheckCircle className="h-8 w-8 text-emerald-600" />
            </div>
            <div>
              <p className="text-lg font-bold">Subscription Activated!</p>
              <p className="mt-1 text-sm text-foreground/60">
                You can now download your assessment report.
              </p>
            </div>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-lavender-deep" />
                Unlock {planName}
              </DialogTitle>
              <DialogDescription>
                Subscribe to download your personalized PDF report with detailed insights.
              </DialogDescription>
            </DialogHeader>

            {/* Plan summary */}
            <div className="rounded-2xl bg-lavender/20 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold">{planName}</p>
                  <p className="text-xs text-foreground/50">1 Month Access</p>
                </div>
                <div className="text-right">
                  {discount > 0 && discount < 100 ? (
                    <>
                      <p className="text-xs text-foreground/40 line-through">
                        ₹{planPrice.toLocaleString("en-IN")}
                      </p>
                      <p className="text-lg font-extrabold text-lavender-deep">
                        ₹{finalAmount.toLocaleString("en-IN")}
                      </p>
                    </>
                  ) : discount === 100 ? (
                    <p className="text-lg font-extrabold text-emerald-600">FREE</p>
                  ) : (
                    <p className="text-lg font-extrabold text-lavender-deep">
                      ₹{planPrice.toLocaleString("en-IN")}
                    </p>
                  )}
                </div>
              </div>
              {discount > 0 && discount < 100 && (
                <p className="mt-2 text-xs font-semibold text-emerald-600">
                  <Tag className="mr-1 inline h-3 w-3" />
                  {discount}% discount applied
                </p>
              )}
            </div>

            {/* Coupon input */}
            {step === "idle" && (
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter coupon code"
                    value={couponCode}
                    onChange={(e) => {
                      setCouponCode(e.target.value.toUpperCase());
                      setCouponError("");
                    }}
                    onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
                    disabled={step === "validating"}
                    className="flex-1 uppercase tracking-wider"
                  />
                  <Button
                    variant="outline"
                    onClick={handleApplyCoupon}
                    disabled={!couponCode.trim() || step === "validating"}
                    className="shrink-0 cursor-pointer"
                  >
                    Apply
                  </Button>
                </div>
                {couponError && (
                  <p className="text-xs font-medium text-rose-600">{couponError}</p>
                )}
              </div>
            )}

            {step === "validating" && (
              <div className="flex items-center justify-center gap-2 py-2 text-sm text-foreground/60">
                <LoaderCircle className="h-4 w-4 animate-spin" />
                Validating coupon…
              </div>
            )}

            {/* Actions */}
            {step !== "validating" && (
              <div className="space-y-2">
                {discount === 100 ? (
                  <Button
                    onClick={handlePay}
                    disabled={step === "processing"}
                    className="w-full h-11 rounded-2xl bg-gradient-brand text-sm font-semibold text-white shadow-glow hover:opacity-95 cursor-pointer"
                  >
                    {step === "processing" ? (
                      <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        Activate Free <ArrowRight className="ml-1.5 h-4 w-4" />
                      </>
                    )}
                  </Button>
                ) : (
                  <Button
                    onClick={handlePay}
                    disabled={step === "processing"}
                    className="w-full h-11 rounded-2xl bg-gradient-brand text-sm font-semibold text-white shadow-glow hover:opacity-95 cursor-pointer"
                  >
                    {step === "processing" ? (
                      <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        Pay ₹{finalAmount.toLocaleString("en-IN")}{" "}
                        <ArrowRight className="ml-1.5 h-4 w-4" />
                      </>
                    )}
                  </Button>
                )}

                {step === "idle" && !couponCode.trim() && (
                  <p className="text-center text-xs text-foreground/40">
                    Have a coupon? Enter it above before paying.
                  </p>
                )}
              </div>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
