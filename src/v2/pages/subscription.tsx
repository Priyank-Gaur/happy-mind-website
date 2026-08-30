import { V2Link, useV2Navigate } from "@/v2/lib/router";
import { useEffect, useState } from "react";
import { Sparkles, Zap, LoaderCircle, ArrowRight } from "lucide-react";
import { DashboardShell, TopHeaderBar } from "@/v2/components/dashboard-shell";
import { Button } from "@/v2/components/ui/button";
import {
  fetchUserDashboard,
  fetchSubscribedServices,
  fetchPackages,
  payForBundle,
  type ApiDashboard,
  type SubscribedServicesResponse,
  type Package,
} from "@/v2/lib/website-api";
import { auth, useAuth } from "@/v2/lib/auth";
import { toast } from "sonner";

export default SubscriptionPage;

import { useProtectedRoute, checkAuthOrRedirect } from "@/v2/lib/auth-guard";

function SubscriptionPage() {
  const navigate = useV2Navigate();
  const { user } = useAuth();
  useProtectedRoute("Please log in to view or manage your subscriptions.");

  const [dashboard, setDashboard] = useState<ApiDashboard | null>(null);
  const [subscribedData, setSubscribedData] = useState<SubscribedServicesResponse | null>(null);
  const [apiPackages, setApiPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [buyingId, setBuyingId] = useState<number | null>(null);

  useEffect(() => {
    if (user?.token) {
      Promise.all([
        fetchUserDashboard(user.token).catch(() => null),
        fetchSubscribedServices(user.token).catch(() => null),
        fetchPackages().catch(() => []),
      ]).then(([dash, sub, pkgs]) => {
        if (dash) setDashboard(dash);
        if (sub) setSubscribedData(sub);
        if (pkgs && pkgs.length > 0) setApiPackages(pkgs);
        setLoading(false);
      });
    } else {
      fetchPackages().then((pkgs) => setApiPackages(pkgs)).catch(() => {}).finally(() => setLoading(false));
    }
  }, [user?.token]);

  const handleBuyPackage = async (pkg: Package) => {
    if (!checkAuthOrRedirect(navigate, "/subscription", "Please log in to purchase a plan.")) {
      return;
    }
    const token = auth.get()?.token;
    const firstPlan = pkg.plans?.[0];
    if (!firstPlan) {
      toast.error("Selected plan details not found");
      return;
    }

    setBuyingId(pkg.id);

    try {
      const res = await payForBundle(
        {
          plan_id: firstPlan.id,
          amount: firstPlan.selling_price ?? firstPlan.price,
          coupen_id: 0,
        },
        token,
      );

      console.log("🌐 [Website API] Payment Link Response:", res);

      if (res?.link) {
        toast.success("Redirecting to secure payment gateway…");
        window.location.href = res.link;
        return;
      } else {
        toast.success(`Purchased ${pkg.name}!`);
      }
    } catch (err: any) {
      console.warn("Plan purchase API notice:", err);
      toast.error(err?.message ?? `Failed to initiate payment for ${pkg.name}`);
    } finally {
      setBuyingId(null);
    }
  };

  const activeSubscribedPackages = subscribedData?.packages?.filter((p) => p.is_subscribed) ?? [];

  // Explicit package IDs for the 6 Growth Plans (SELF STARTER, BUDDY, BUDDY PLUS, CARE 3X, CARE 6X, CARE 12X)
  const GROWTH_PACKAGE_IDS = new Set([17, 18, 19, 20, 21, 22]);
  const growthPackages = apiPackages.filter((pkg) => GROWTH_PACKAGE_IDS.has(pkg.id));

  return (
    <DashboardShell
      header={<TopHeaderBar title="My Subscription" subtitle="Your membership & plans from the comparison table" />}
    >
      <div className="space-y-10 pb-10">
        {/* Section 1 — Current Active Subscriptions */}
        <section className="relative overflow-hidden rounded-[32px] bg-gradient-hero p-6 shadow-card sm:p-9">
          <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-white/40 blur-3xl" />
          <div className="relative">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-lavender-deep/15 pb-6">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3.5 py-1 text-xs font-bold text-lavender-deep shadow-soft">
                  <Sparkles className="h-3.5 w-3.5" /> Membership Overview
                </span>
                <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
                  Active Subscription Plans
                </h2>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-8 text-muted-foreground gap-2">
                <LoaderCircle className="h-5 w-5 animate-spin text-lavender-deep" />
                <span className="text-sm">Loading active plans…</span>
              </div>
            ) : activeSubscribedPackages.length > 0 ? (
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {activeSubscribedPackages.map((pkg) => (
                  <div key={pkg.id} className="rounded-2xl bg-white/80 p-4 shadow-soft">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-foreground">{pkg.name}</h4>
                      <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-extrabold uppercase text-emerald-700">
                        Active
                      </span>
                    </div>
                    {pkg.description && (
                      <p className="mt-1 text-xs text-muted-foreground">{pkg.description}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-6 text-sm text-muted-foreground">
                No active plans found. Choose a plan below to start your growth journey.
              </div>
            )}
          </div>
        </section>

        {/* Section 2 — Growth Plans Catalog (Fetched Dynamically from API) */}
        <section>
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-2xl bg-white shadow-soft">
                <Zap className="h-5 w-5 text-lavender-deep" />
              </span>
              <div>
                <h3 className="text-xl font-bold tracking-tight sm:text-2xl">Growth Plans</h3>
                <p className="text-sm text-muted-foreground">
                  Official growth plans fetched directly from the backend API.
                </p>
              </div>
            </div>
            {/* Compare Features button redirects to plans page (/services/happiself) */}
            <Button asChild variant="ghost" size="sm" className="rounded-full text-xs font-semibold text-lavender-deep">
              <V2Link to="/services/happiself">Compare Features →</V2Link>
            </Button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12 text-muted-foreground gap-2">
              <LoaderCircle className="h-6 w-6 animate-spin text-lavender-deep" />
              <span className="text-sm">Loading growth plans catalog…</span>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {growthPackages.map((pkg) => {
                const plan = pkg.plans?.[0];
                const sellingPrice = plan?.selling_price ?? plan?.price ?? 0;
                const mrp = plan?.price && plan.price > sellingPrice ? plan.price : undefined;
                const rawDuration = plan?.duration?.name;
                const VALIDITY_MAP: Record<number, string> = { 17: "1 Month", 18: "1 Month", 19: "3 Months", 20: "3 Months", 21: "6 Months", 22: "12 Months" };
                const durationName = (rawDuration && rawDuration !== "Onetime pay") ? rawDuration : (VALIDITY_MAP[pkg.id] ?? "1 Month");
                const isBestValue = pkg.name.toUpperCase().includes("12X");

                return (
                  <div
                    key={pkg.id}
                    className={`relative flex flex-col justify-between rounded-[28px] bg-white p-6 shadow-soft border transition-all duration-300 hover:-translate-y-1 hover:shadow-card ${
                      isBestValue ? "border-lavender-deep/40 ring-2 ring-lavender-deep/20" : "border-border/60"
                    }`}
                  >
                    {isBestValue && (
                      <span className="absolute -top-3 right-6 rounded-full bg-gradient-brand px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white shadow-glow">
                        Best Value
                      </span>
                    )}

                    <div>
                      <h4 className="text-xl font-bold tracking-tight text-foreground">{pkg.name}</h4>
                      <div className="mt-3 flex items-baseline gap-2">
                        <span className="text-3xl font-extrabold tracking-tight text-lavender-deep">
                          ₹{sellingPrice.toLocaleString("en-IN")}
                        </span>
                        {mrp && (
                          <span className="text-sm font-semibold text-muted-foreground line-through">
                            ₹{mrp.toLocaleString("en-IN")}
                          </span>
                        )}
                        <span className="text-xs text-muted-foreground font-medium">/ {durationName}</span>
                      </div>
                      <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                        {pkg.description || "Comprehensive mental wellness growth plan."}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-border/40">
                      <Button
                        disabled={buyingId === pkg.id}
                        onClick={() => handleBuyPackage(pkg)}
                        className="w-full h-11 rounded-2xl bg-gradient-brand text-sm font-semibold text-white shadow-glow hover:opacity-95 cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        {buyingId === pkg.id ? (
                          <LoaderCircle className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            Buy Plan <ArrowRight className="h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </DashboardShell>
  );
}
