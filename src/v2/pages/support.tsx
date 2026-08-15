import { useState } from "react";
import { LifeBuoy, Mail, Phone, CircleHelp, ShieldCheck, Sparkles } from "lucide-react";
import { DashboardShell, TopHeaderBar } from "@/v2/components/dashboard-shell";
import { Button } from "@/v2/components/ui/button";
import { Textarea } from "@/v2/components/ui/textarea";
import { Label } from "@/v2/components/ui/label";
import { toast } from "sonner";

import { raiseQuery } from "@/v2/lib/website-api";
import { auth } from "@/v2/lib/auth";

export default SupportPage;

function SupportPage() {
  const [category, setCategory] = useState("");
  const [queryMessage, setQueryMessage] = useState("");
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category || !queryMessage.trim()) return;

    setProcessing(true);
    const token = auth.get()?.token;

    try {
      const res = await raiseQuery(
        {
          category: category as any,
          query: queryMessage.trim(),
        },
        token || "",
      );

      toast.success(res?.message || "Query raised successfully. You will receive an update shortly.");
      setCategory("");
      setQueryMessage("");
    } catch (err: any) {
      toast.error(err?.message || "Failed to submit query. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  const isSubmitDisabled = !category || !queryMessage.trim() || processing;

  return (
    <DashboardShell
      header={
        <TopHeaderBar
          title="Support Center"
          emoji=""
          subtitle="We're here to help. Raise a query or reach out to our team."
        />
      }
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        {/* Left Column: Form */}
        <div className="space-y-6">
          <section className="rounded-[2rem] bg-white/95 p-6 shadow-soft border border-white/80 sm:p-8">
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-brand shadow-glow text-white">
                <LifeBuoy className="h-6 w-6" strokeWidth={2} />
              </div>
              <div>
                <h2 className="text-xl font-bold tracking-tight">Raise a Query</h2>
                <p className="text-sm text-muted-foreground">Select a category and describe the issue you are facing.</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              {/* Category Field */}
              <div>
                <Label htmlFor="category" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Select a category <span className="text-destructive">*</span>
                </Label>
                <div className="mt-2">
                  <select
                    id="category"
                    name="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="flex h-12 w-full rounded-2xl border border-input/60 bg-white/70 px-4 py-2 text-sm shadow-soft transition-all duration-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-lavender-deep/30 focus:border-lavender-deep/40"
                  >
                    <option value="">Select a category</option>
                    <option value="screening">Screening</option>
                    <option value="payment">Payment</option>
                    <option value="service">Service</option>
                    <option value="others">Others</option>
                  </select>
                </div>
              </div>

              {/* Description Field */}
              <div>
                <Label htmlFor="query_message" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Describe your query <span className="text-destructive">*</span>
                </Label>
                <div className="mt-2">
                  <Textarea
                    id="query_message"
                    name="query"
                    placeholder="Provide details about your query..."
                    value={queryMessage}
                    onChange={(e) => setQueryMessage(e.target.value)}
                    className="min-h-[140px] rounded-2xl border border-input/60 bg-white/70 px-4 py-3 text-sm shadow-soft transition-all duration-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-lavender-deep/30 focus:border-lavender-deep/40 placeholder:text-muted-foreground/60"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Button
                  type="submit"
                  disabled={isSubmitDisabled}
                  size="lg"
                  className="rounded-full bg-gradient-brand px-8 text-sm font-semibold text-white shadow-glow transition duration-200 hover:opacity-95 disabled:opacity-50"
                >
                  {processing ? "Submitting..." : "Submit Query"}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setCategory("");
                    setQueryMessage("");
                  }}
                  className="rounded-full px-6 text-sm font-semibold hover:bg-lavender/20"
                >
                  Clear Form
                </Button>
              </div>
            </form>
          </section>

          {/* Quick Guidance info */}
          <div className="rounded-[2rem] bg-gradient-hero p-6 shadow-soft md:p-8">
            <div className="flex items-start gap-4">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/80 shadow-soft">
                <Sparkles className="h-5 w-5 text-lavender-deep" />
              </div>
              <div>
                <h3 className="text-base font-bold">What happens next?</h3>
                <p className="mt-2 text-sm leading-relaxed text-foreground/75">
                  Our operations team reviews raised queries instantly. In most cases, queries are resolved within 24 business hours, and you will receive a detailed response sent directly to your registered email address.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Contact info */}
        <div className="space-y-4">
          <section className="rounded-[2rem] bg-white/95 p-6 shadow-soft border border-white/80">
            <h3 className="text-base font-bold tracking-tight">Direct Contact Details</h3>
            <p className="mt-1 text-xs text-muted-foreground">Reach us directly for immediate assistance.</p>
            <div className="mt-5 space-y-4">
              {/* Phone */}
              <div className="flex items-center gap-3.5 rounded-2xl bg-lavender/20 p-3.5">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-lavender-deep shadow-soft">
                  <Phone className="h-4.5 w-4.5" />
                </div>
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Call Support</div>
                  <div className="mt-0.5 text-sm font-semibold">9136899581</div>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center gap-3.5 rounded-2xl bg-aqua/20 p-3.5">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-sky-700 shadow-soft">
                  <Mail className="h-4.5 w-4.5" />
                </div>
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Email Support</div>
                  <a href="mailto:support@happimynd.com" className="mt-0.5 text-sm font-semibold text-sky-800 hover:underline">
                    support@happimynd.com
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* Offices card */}
          <section className="rounded-[2rem] bg-white/95 p-6 shadow-soft border border-white/80">
            <h3 className="text-sm font-bold tracking-tight text-foreground uppercase tracking-wider">Our Offices</h3>
            <div className="mt-3 text-xs leading-relaxed text-muted-foreground space-y-2">
              <p className="font-semibold text-foreground">Gurgaon Office (India)</p>
              <p>Sec-49, Gurgaon, Haryana, India</p>
              <div className="h-px bg-lavender/30 my-2" />
            </div>
          </section>

          {/* FAQ Helper Card */}
          <section className="rounded-[2rem] bg-white/95 p-6 shadow-soft border border-white/80">
            <div className="flex items-center gap-3 text-foreground">
              <CircleHelp className="h-5 w-5 text-lavender-deep" />
              <h3 className="text-sm font-bold tracking-tight">Looking for FAQs?</h3>
            </div>
            <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
              Find instant answers to common questions about Self Check Ins, services, packages, and privacy policy in our full FAQ.
            </p>
            <a
              href="/faq"
              className="mt-4 inline-flex items-center text-xs font-bold text-lavender-deep hover:underline"
            >
              Go to FAQs
            </a>
          </section>
        </div>
      </div>
    </DashboardShell>
  );
}
