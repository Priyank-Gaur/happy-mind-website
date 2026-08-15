import { useLocation } from "react-router-dom";
import { V2Link } from "@/v2/lib/router";
import { useEffect, useState } from "react";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/v2/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/v2/components/ui/sheet";
import { useCart } from "@/v2/lib/cart-store";

export function CartHeaderButton() {
  const { items, hydrated } = useCart();
  const count = items.length;
  return (
    <V2Link
      to="/cart"
      aria-label="Open cart"
      className="relative grid h-9 w-9 md:h-11 md:w-11 shrink-0 place-items-center rounded-full bg-white/70 shadow-soft transition hover:bg-white"
    >
      <ShoppingCart className="h-4 w-4 md:h-5 md:w-5 text-foreground" strokeWidth={2} />
      {hydrated && count > 0 && (
        <span className="absolute -right-1 -top-1 grid h-4 md:h-5 min-w-[16px] md:min-w-[20px] place-items-center rounded-full bg-gradient-brand px-1 text-[9px] md:text-[10px] font-bold text-white shadow-glow">
          {count}
        </span>
      )}
    </V2Link>
  );
}

const KEY = "happimynd_cart_reminder_seen";

export function CartAbandonmentDrawer() {
  const { items, hydrated } = useCart();
  const pathname = useLocation().pathname;
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!hydrated) return;
    if (items.length === 0) return;
    if (
      pathname.startsWith("/cart") ||
      pathname.startsWith("/checkout")
    )
      return;
    if (typeof sessionStorage === "undefined") return;
    if (sessionStorage.getItem(KEY)) return;
    const t = setTimeout(() => {
      setOpen(true);
      sessionStorage.setItem(KEY, "1");
    }, 20000);
    return () => clearTimeout(t);
  }, [hydrated, items.length, pathname]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="right" className="w-[92vw] max-w-md bg-white">
        <SheetHeader className="text-left">
          <SheetTitle className="text-xl">Your selected plan is waiting.</SheetTitle>
          <SheetDescription>
            Your selected services have been saved to your cart. Continue whenever you're ready.
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-3">
          {items.slice(0, 3).map((i) => (
            <div key={i.id} className="rounded-2xl bg-lavender/20 p-3 text-sm">
              <div className="font-semibold">{i.serviceName}</div>
              <div className="text-xs text-muted-foreground">
                {i.planName} · ₹{i.price.toLocaleString()}
              </div>
            </div>
          ))}
        </div>

        <SheetFooter className="mt-6 flex flex-col gap-2 sm:flex-col">
          <Button asChild className="rounded-full bg-gradient-brand shadow-glow hover:opacity-95">
            <V2Link to="/cart" onClick={() => setOpen(false)}>
              Resume Purchase
            </V2Link>
          </Button>
          <Button
            variant="outline"
            className="rounded-full border-lavender-deep/20 bg-white/70"
            onClick={() => setOpen(false)}
          >
            Continue Exploring
          </Button>
        </SheetFooter>

        <p className="mt-6 text-center text-[11px] text-muted-foreground">
          Your cart will remain saved for future access.
        </p>
      </SheetContent>
    </Sheet>
  );
}
