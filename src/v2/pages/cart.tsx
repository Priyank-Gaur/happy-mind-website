import { V2Link, useV2Navigate } from "@/v2/lib/router";
import { useState } from "react";
import { ShoppingBag, Trash2, Pencil, Plus, Sparkles } from "lucide-react";
import { DashboardShell, TopHeaderBar } from "@/v2/components/dashboard-shell";
import { Button } from "@/v2/components/ui/button";
import { useCart, cart } from "@/v2/lib/cart-store";
import { SERVICE_CATALOG } from "@/v2/data/service-catalog";
import { toast } from "sonner";
import { useProtectedRoute } from "@/v2/lib/auth-guard";

export default CartPage;

function CartPage() {
  useProtectedRoute("Please log in to view your cart.");
  const { items, hydrated } = useCart();
  const navigate = useV2Navigate();

  const subtotal = items.reduce((s, i) => s + i.price, 0);
  const taxes = Math.round(subtotal * 0.18);
  const total = subtotal + taxes;

  const suggestions = Object.values(SERVICE_CATALOG)
    .filter((s) => !items.some((i) => i.serviceKey === s.slug))
    .slice(0, 2);

  return (
    <DashboardShell
      header={<TopHeaderBar title="Shopping Cart" subtitle="Review your selections before checkout." emoji="" />}
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-lavender-deep" />
            <h2 className="text-xl font-bold">Your Cart</h2>
            <span className="ml-auto text-xs text-muted-foreground">
              {hydrated ? `${items.length} item${items.length === 1 ? "" : "s"}` : ""}
            </span>
          </div>

          {hydrated && items.length === 0 ? (
            <div className="rounded-3xl bg-white/95 p-10 text-center shadow-soft border border-white/80">
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-lavender/40 text-lavender-deep">
                <ShoppingBag className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">Your cart is empty</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Explore services and choose the plan that fits you best.
              </p>
              <Button asChild className="mt-6 rounded-full bg-gradient-brand shadow-glow hover:opacity-95">
                <V2Link to="/services">Browse Services</V2Link>
              </Button>
            </div>
          ) : (
            items.map((i) => (
              <div
                key={i.id}
                className="flex flex-col gap-4 rounded-3xl bg-white/95 p-5 shadow-soft border border-white/80 sm:flex-row sm:items-center"
              >
                <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-brand text-white shadow-glow">
                  <Sparkles className="h-6 w-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-bold">{i.serviceName}</span>
                    {i.bundle && (
                      <span className="rounded-full bg-lavender/40 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-lavender-deep">
                        Bundle
                      </span>
                    )}
                  </div>
                  <div className="mt-0.5 text-sm text-muted-foreground">
                    {i.planName} · {i.duration}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold">₹{i.price.toLocaleString()}</div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full border-lavender-deep/20 bg-white/70"
                    onClick={() => navigate({ to: "/services/$slug", params: { slug: i.serviceKey } })}
                  >
                    <Pencil className="mr-1 h-3.5 w-3.5" />
                    Modify
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="rounded-full text-destructive hover:bg-destructive/10"
                    onClick={() => {
                      cart.remove(i.id);
                      toast.success("Removed from cart");
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}

        </div>

        {/* Summary */}
        <div className="space-y-4">
          <div className="rounded-3xl bg-white/95 p-6 shadow-card border border-white/80">
            <h3 className="text-base font-bold">Order Summary</h3>
            <dl className="mt-4 space-y-2.5 text-sm">
              <SumRow label="Subtotal" value={`₹${subtotal.toLocaleString()}`} />
              <SumRow label="Taxes (18%)" value={`₹${taxes.toLocaleString()}`} muted />
              <div className="my-2 h-px bg-lavender/40" />
              <SumRow label="Grand Total" value={`₹${total.toLocaleString()}`} bold />
            </dl>
            <Button
              disabled={items.length === 0}
              onClick={() => navigate({ to: "/checkout" })}
              size="lg"
              className="mt-5 w-full rounded-full bg-gradient-brand shadow-glow hover:opacity-95"
            >
              Proceed to Checkout
            </Button>
            <Button
              asChild
              variant="outline"
              className="mt-3 w-full rounded-full border-lavender-deep/20 bg-white/70"
            >
              <V2Link to="/services">Continue Browsing Services</V2Link>
            </Button>
          </div>

          <div className="rounded-3xl bg-white/95 p-6 shadow-soft border border-white/80">
            <h3 className="text-base font-bold">You may also like</h3>
            <div className="mt-4 space-y-3">
              {suggestions.map((s) => (
                <div key={s.slug} className="flex items-center gap-3 rounded-2xl bg-white/60 p-3">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-lavender/40 text-lavender-deep">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold">{s.name}</div>
                    <div className="truncate text-xs text-muted-foreground">{s.tagline}</div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-full border-lavender-deep/20 bg-white"
                    onClick={() => navigate({ to: "/services/$slug", params: { slug: s.slug } })}
                  >
                    <Plus className="mr-1 h-3.5 w-3.5" /> Add
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}

function SumRow({ label, value, bold, muted }: { label: string; value: string; bold?: boolean; muted?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <dt className={muted ? "text-muted-foreground" : ""}>{label}</dt>
      <dd className={bold ? "text-lg font-bold" : "font-medium"}>{value}</dd>
    </div>
  );
}
