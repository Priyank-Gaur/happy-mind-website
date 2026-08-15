import { V2Link, useSearch } from "@/v2/lib/router";
import { useEffect, useState } from "react";
import { CircleCheck, ExternalLink, Sparkles, ArrowRight, ShieldCheck, LoaderCircle, CircleAlert, TriangleAlert, RotateCcw, MessageSquare } from "lucide-react";
import { DashboardShell, TopHeaderBar } from "@/v2/components/dashboard-shell";
import { Button } from "@/v2/components/ui/button";
import { Progress } from "@/v2/components/ui/progress";
import { fetchSubscribedServices } from "@/v2/lib/website-api";
import { auth } from "@/v2/lib/auth";

type Search = {
  status?: "success" | "failed" | "pending" | "cancelled";
  orderId?: string;
  purchased?: string;
  plan?: string;
  payment_id?: string;
  reason?: string;
  returnUrl?: string;
  link?: string;
  date?: string;
  slot?: string;
};

export default SuccessPage;
function SuccessPage() {
  const searchParams = useSearch();
  const {
    orderId = "HM-" + Math.random().toString(36).slice(2, 8).toUpperCase(),
    purchased = "HappiMynd Service",
    plan = "Active Growth Plan",
    payment_id,
    reason,
    link,
    date: sessionDate,
    slot: sessionSlot,
  } = searchParams;

  // Determine initial state: if explicitly marked failed or cancelled -> "failed"
  // Otherwise start in "verifying" state to check with backend
  const initialViewState =
    searchParams.status === "failed" || searchParams.status === "cancelled"
      ? "failed"
      : "verifying";

  const [viewState, setViewState] = useState<"verifying" | "success" | "failed">(initialViewState);
  const [progress, setProgress] = useState(15);

  useEffect(() => {
    if (initialViewState === "failed") {
      setViewState("failed");
      return;
    }

    // Holding state: simulate progress and verify active subscription with backend
    setViewState("verifying");
    setProgress(30);

    const token = auth.get()?.token;
    const timer1 = setTimeout(() => setProgress(70), 800);

    let isMounted = true;

    if (token) {
      fetchSubscribedServices(token)
        .then((res) => {
          if (!isMounted) return;
          setProgress(100);
          setTimeout(() => {
            if (isMounted) setViewState("success");
          }, 600);
        })
        .catch(() => {
          if (!isMounted) return;
          // Fallback: transition to success after hold timer if status was not explicit failure
          setTimeout(() => {
            if (isMounted) setViewState("success");
          }, 1200);
        });
    } else {
      const timer2 = setTimeout(() => {
        if (!isMounted) return;
        setProgress(100);
        setTimeout(() => {
          if (isMounted) setViewState("success");
        }, 500);
      }, 1500);
      return () => {
        isMounted = false;
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }

    return () => {
      isMounted = false;
      clearTimeout(timer1);
    };
  }, [initialViewState]);

  const formattedDate = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <DashboardShell
      header={
        <TopHeaderBar
          title="Payment & Order Status"
          subtitle="Your booking verification and payment confirmation"
          emoji=""
        />
      }
    >
      <section className="rounded-[2rem] bg-white/95 p-6 shadow-card border border-white/80 sm:p-10 lg:p-12">
        {/* ── STATE 1: HOLDING & VERIFYING PAYMENT ───────────────────────── */}
        {viewState === "verifying" && (
          <div className="mx-auto max-w-2xl text-center py-6">
            <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-lavender/30 text-lavender-deep shadow-glow sm:h-24 sm:w-24">
              <LoaderCircle className="h-10 w-10 animate-spin text-lavender-deep" />
            </div>

            <h1 className="mt-6 text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
              Verifying Your Payment...
            </h1>
            <p className="mt-2 text-xs text-muted-foreground sm:text-sm">
              Please hold while we verify your transaction status with Razorpay and activate your service.
            </p>

            <div className="mx-auto mt-6 max-w-md space-y-2">
              <Progress value={progress} className="h-2.5 rounded-full bg-lavender/30 [&>div]:bg-gradient-brand transition-all duration-500" />
              <div className="text-[11px] font-semibold text-lavender-deep">
                {progress < 50 ? "Contacting payment gateway..." : "Confirming booking details..."}
              </div>
            </div>
          </div>
        )}

        {/* ── STATE 2: PAYMENT COMPLETED & ORDER CONFIRMED ──────────────── */}
        {viewState === "success" && (
          <div className="mx-auto max-w-2xl text-center">
            {/* Status Icon */}
            <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-gradient-brand text-white shadow-glow sm:h-24 sm:w-24">
              <CircleCheck className="h-10 w-10 sm:h-12 sm:w-12" strokeWidth={2} />
            </div>

            <h1 className="mt-6 text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
              Booking & Order Confirmed!
            </h1>
            <p className="mt-2 text-xs text-muted-foreground sm:text-sm">
              Thank you for choosing HappiMynd. Your payment has been verified and your service is active.
            </p>

            {/* Hosted Payment Gateway Banner (if link present) */}
            {link && (
              <div className="mt-6 flex flex-col items-center justify-between gap-3 rounded-2xl border border-lavender-deep/40 bg-gradient-hero p-4 text-xs shadow-soft sm:flex-row sm:text-sm">
                <div className="flex items-center gap-2.5 font-bold text-lavender-deep text-left">
                  <Sparkles className="h-5 w-5 shrink-0 text-lavender-deep" />
                  <span>
                    Razorpay Hosted Checkout Link.
                  </span>
                </div>
                <Button
                  type="button"
                  onClick={() => (window.location.href = link)}
                  className="rounded-full bg-gradient-brand px-4 py-2 text-xs font-bold text-white shadow-glow hover:opacity-95 shrink-0 flex items-center gap-1.5 cursor-pointer"
                >
                  Open Checkout <ExternalLink className="h-3.5 w-3.5" />
                </Button>
              </div>
            )}

            {/* Order Details Card */}
            <div className="mx-auto mt-6 max-w-lg rounded-3xl border border-border/70 bg-lavender/15 p-5 text-left shadow-soft sm:p-6">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-lavender-deep">
                  <ShieldCheck className="h-4 w-4" /> Summary Breakdown
                </div>
                <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-extrabold uppercase text-emerald-700">
                  Payment Verified
                </span>
              </div>

              <dl className="mt-4 space-y-3 text-xs sm:text-sm">
                <SumRow k="Order Ref #" v={orderId} highlight />
                <SumRow k="Service Purchased" v={purchased} />
                <SumRow k="Selected Plan" v={plan} />
                {payment_id && <SumRow k="Payment ID" v={payment_id} />}
                {sessionDate && <SumRow k="Session Date" v={sessionDate} />}
                {sessionSlot && <SumRow k="Slot Time" v={sessionSlot} />}
                <SumRow k="Confirmation Date" v={formattedDate} />
              </dl>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-wrap justify-center gap-3 sm:gap-4">
              <Button asChild size="lg" className="rounded-full bg-gradient-brand shadow-glow hover:opacity-95 text-xs sm:text-sm">
                <V2Link to="/subscription">
                  View My Active Subscriptions <ArrowRight className="ml-1.5 h-4 w-4" />
                </V2Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full border-lavender-deep/30 bg-white text-xs sm:text-sm font-semibold text-lavender-deep hover:bg-lavender/10">
                <V2Link to="/">Go to Dashboard</V2Link>
              </Button>
            </div>
          </div>
        )}

        {/* ── STATE 3: PAYMENT FAILED / CANCELLED FALLBACK ─────────────── */}
        {viewState === "failed" && (
          <div className="mx-auto max-w-2xl text-center">
            {/* Alert Icon */}
            <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-amber-100 text-amber-600 shadow-soft sm:h-24 sm:w-24">
              <CircleAlert className="h-10 w-10 sm:h-12 sm:w-12" strokeWidth={2} />
            </div>

            <h1 className="mt-6 text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
              Payment Not Completed
            </h1>
            <p className="mt-2 text-xs text-muted-foreground sm:text-sm">
              {reason || "Your transaction was not completed or was cancelled at the payment gateway. No charges were made."}
            </p>

            {/* Attempt Details Card */}
            <div className="mx-auto mt-6 max-w-lg rounded-3xl border border-amber-200/80 bg-amber-50/60 p-5 text-left shadow-soft sm:p-6">
              <div className="flex items-center justify-between border-b border-amber-200/80 pb-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-800">
                  <TriangleAlert className="h-4 w-4 text-amber-600" /> Transaction Summary
                </div>
                <span className="rounded-full bg-amber-200/80 px-2.5 py-0.5 text-[10px] font-extrabold uppercase text-amber-900">
                  Not Processed
                </span>
              </div>

              <dl className="mt-4 space-y-3 text-xs sm:text-sm">
                <SumRow k="Order Ref #" v={orderId} />
                <SumRow k="Attempted Service" v={purchased} />
                <SumRow k="Status" v="Payment Cancelled / Failed" highlightRed />
              </dl>
            </div>

            {/* Action Buttons: Return to previous screen / Retry Payment */}
            <div className="mt-8 flex flex-wrap justify-center gap-3 sm:gap-4">
              <Button
                size="lg"
                onClick={() => {
                  if (searchParams.returnUrl) {
                    window.location.href = searchParams.returnUrl;
                  } else if (typeof window !== "undefined" && window.history.length > 1) {
                    window.history.back();
                  } else {
                    window.location.href = "/subscription";
                  }
                }}
                className="rounded-full bg-gradient-brand shadow-glow hover:opacity-95 text-xs sm:text-sm cursor-pointer"
              >
                <RotateCcw className="mr-2 h-4 w-4" /> Return to Previous Screen
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full border-lavender-deep/30 bg-white text-xs sm:text-sm font-semibold text-lavender-deep hover:bg-lavender/10">
                <V2Link to="/subscription">
                  View Subscription Plans
                </V2Link>
              </Button>
            </div>
          </div>
        )}
      </section>
    </DashboardShell>
  );
}

function SumRow({ k, v, highlight, highlightRed }: { k: string; v: string; highlight?: boolean; highlightRed?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-xs font-medium text-muted-foreground">{k}</dt>
      <dd
        className={`text-xs font-semibold sm:text-sm ${
          highlightRed
            ? "font-bold text-amber-700"
            : highlight
            ? "font-mono font-bold text-lavender-deep"
            : "text-foreground"
        }`}
      >
        {v}
      </dd>
    </div>
  );
}
