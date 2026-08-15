import { useEffect, useState } from "react";

export type CartItem = {
  id: string;
  serviceKey: string;
  serviceName: string;
  planName: string;
  duration: string;
  price: number;
  bundle?: boolean;
};

const KEY = "happimynd_cart_v1";
const EVT = "happimynd:cart-change";

function read(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

function write(items: CartItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent(EVT));
}

export const cart = {
  get: read,
  add(item: CartItem) {
    const items = read();
    items.push(item);
    write(items);
  },
  remove(id: string) {
    write(read().filter((i) => i.id !== id));
  },
  clear() {
    write([]);
  },
};

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setItems(read());
    setHydrated(true);
    const onChange = () => setItems(read());
    window.addEventListener(EVT, onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener(EVT, onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);
  return { items, hydrated };
}
