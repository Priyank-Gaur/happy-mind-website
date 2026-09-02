import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/v2/components/ui/dialog";
import { Button } from "@/v2/components/ui/button";
import { Input } from "@/v2/components/ui/input";
import {
  Receipt,
  ShieldCheck,
  Sparkles,
  Tag,
  ArrowRight,
  LoaderCircle,
  Info,
  CheckCircle2,
} from "lucide-react";
import { applyCoupon } from "@/v2/lib/website-api";
import { auth } from "@/v2/lib/auth";
import { toast } from "sonner";

export type PaymentBreakdownModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  itemName: string;
  itemDescription?: string;
  basePrice: number;
  planId?: number;
  initialCouponId?: number | null;
  initialDiscount?: number; // Discount percentage (0-100)
  onConfirmPayment: (couponId?: number) => Promise<void>;
  isLoading?: boolean;
};

export function PaymentBreakdownModal({
  open,
  onOpenChange,
  title = "Order & Payment Breakdown",
  itemName,
  itemDescription,
  basePrice,
  planId,
  initialCouponId = null,
  initialDiscount = 0,
  onConfirmPayment,
  isLoading = false,
}: PaymentBreakdownModalProps) {
  const [submitting, setSubmitting] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState("");
  const [discountPercent, setDiscountPercent] = useState(initialDiscount);
  const [appliedCouponId, setAppliedCouponId] = useState<number | null>(initialCouponId);
  const [validatingCoupon, setValidatingCoupon] = useState(false);

  // Sync initial props when modal opens
  useEffect(() => {
    if (open) {
      setDiscountPercent(initialDiscount);
      setAppliedCouponId(initialCouponId);
      setCouponCode("");
      setCouponError("");
      setSubmitting(false);
    }
  }, [open, initialDiscount, initialCouponId]);

  // Calculations
  const discountAmount = Math.round((basePrice * discountPercent) / 100);
  const subtotal = Math.max(0, basePrice - discountAmount);
  const gstAmount = Math.round(subtotal * 0.18);
  const totalAmountPayable = Math.round(subtotal * 1.18);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    if (!planId) {
      toast.error("Coupon cannot be applied to this item.");
      return;
    }
    const token = auth.get()?.token;
    if (!token) {
      toast.error("Please log in to apply a coupon.");
      return;
    }

    setValidatingCoupon(true);
    setCouponError("");

    try {
      const res = await applyCoupon({ plan_id: planId, coupon: couponCode.trim() }, token);
      if (res.status === "success" && res.data) {
        setDiscountPercent(res.data.discount);
        setAppliedCouponId(res.data.coupon_id);
        toast.success(`Coupon applied! ${res.data.discount}% discount added.`);
      } else {
        setCouponError(res.message || "Invalid coupon code.");
      }
    } catch (err: any) {
      setCouponError(err?.message ?? "Failed to validate coupon.");
    } finally {
      setValidatingCoupon(false);
    }
  };

  const handleConfirm = async () => {
    setSubmitting(true);
    try {
      await onConfirmPayment(appliedCouponId ?? undefined);
    } catch (err) {
      console.error("Payment initiation failed", err);
    } finally {
      setSubmitting(false);
    }
  };

  const isBusy = submitting || isLoading;

  return (
    <Dialog open={open} onOpenChange={(v) => !isBusy && onOpenChange(v)}>
      <DialogContent className="sm:max-w-md rounded-2xl overflow-hidden p-0 gap-0 border-lavender-soft/30 shadow-2xl">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-lavender-deep/10 via-purple-500/10 to-emerald-500/10 p-6 border-b border-border/40">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl font-bold text-foreground">
              <Receipt className="h-5 w-5 text-lavender-deep" />
              {title}
            </DialogTitle>
            <DialogDescription className="text-xs text-foreground/70 mt-1">
              Review your item details and price breakdown before proceeding to the secure payment gateway.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-6 space-y-5 bg-background">
          {/* Selected Package Details */}
          <div className="rounded-xl border border-lavender-soft/40 bg-lavender-soft/10 p-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-lavender-deep bg-lavender-deep/10 px-2 py-0.5 rounded-full">
                  Selected Item
                </span>
                <h4 className="text-base font-bold text-foreground mt-1">{itemName}</h4>
                {itemDescription && (
                  <p className="text-xs text-foreground/60 mt-0.5">{itemDescription}</p>
                )}
              </div>
              <div className="text-right">
                <span className="text-xs text-muted-foreground block">Base Price</span>
                <span className="text-base font-bold text-foreground">
                  ₹{basePrice.toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          </div>

          {/* Coupon Code Section (if planId supported) */}
          {planId && (
            <div className="space-y-2">
              <div className="flex gap-2">
                <Input
                  placeholder="Have a coupon code?"
                  value={couponCode}
                  onChange={(e) => {
                    setCouponCode(e.target.value.toUpperCase());
                    setCouponError("");
                  }}
                  onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
                  disabled={validatingCoupon || isBusy}
                  className="h-9 text-xs uppercase tracking-wider border-border/60"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleApplyCoupon}
                  disabled={!couponCode.trim() || validatingCoupon || isBusy}
                  className="h-9 text-xs shrink-0 cursor-pointer border-lavender-soft/50 hover:bg-lavender-soft/20"
                >
                  {validatingCoupon ? (
                    <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    "Apply"
                  )}
                </Button>
              </div>
              {couponError && (
                <p className="text-[11px] font-medium text-rose-600 pl-1">{couponError}</p>
              )}
              {discountPercent > 0 && (
                <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold pl-1">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  {discountPercent}% Promo Discount Applied!
                </div>
              )}
            </div>
          )}

          {/* Breakdown Calculation Box */}
          <div className="rounded-xl border border-border/60 bg-muted/30 p-4 space-y-2.5 text-xs">
            <div className="flex justify-between text-foreground/80">
              <span>Base Amount</span>
              <span className="font-medium">₹{basePrice.toLocaleString("en-IN")}</span>
            </div>

            {discountPercent > 0 && (
              <div className="flex justify-between text-emerald-600 font-medium">
                <span className="flex items-center gap-1">
                  <Tag className="h-3 w-3" /> Coupon Discount ({discountPercent}%)
                </span>
                <span>- ₹{discountAmount.toLocaleString("en-IN")}</span>
              </div>
            )}

            {discountPercent > 0 && (
              <div className="flex justify-between text-foreground/80 pt-1 border-t border-border/40">
                <span>Subtotal</span>
                <span className="font-medium">₹{subtotal.toLocaleString("en-IN")}</span>
              </div>
            )}

            <div className="flex justify-between text-foreground/80">
              <span className="flex items-center gap-1">
                GST (18%)
                <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.2 rounded border border-border/40">
                  Tax
                </span>
              </span>
              <span className="font-medium text-slate-700 dark:text-slate-300">
                + ₹{gstAmount.toLocaleString("en-IN")}
              </span>
            </div>

            <div className="border-t border-border/80 pt-2.5 mt-2 flex justify-between items-baseline">
              <div>
                <span className="text-sm font-bold text-foreground">Total Payable</span>
                <span className="block text-[10px] text-muted-foreground">
                  Includes all applicable taxes
                </span>
              </div>
              <div className="text-right">
                <span className="text-lg font-black text-lavender-deep">
                  ₹{totalAmountPayable.toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isBusy}
              className="w-1/3 h-11 text-xs font-semibold rounded-xl border-border/80 cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={isBusy}
              className="w-2/3 h-11 rounded-xl bg-gradient-brand text-xs font-bold text-white shadow-glow hover:brightness-110 active:scale-98 transition-all cursor-pointer"
            >
              {isBusy ? (
                <>
                  <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                  Connecting Gateway…
                </>
              ) : (
                <>
                  Proceed to Pay ₹{totalAmountPayable.toLocaleString("en-IN")}
                  <ArrowRight className="ml-1.5 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
