"use client";

import { useSyncExternalStore } from "react";
import { resolveLine } from "@/lib/lite";

/** One cart line per product and option combination. */
export type CartItem = { slug: string; opt: string | null; qty: number };

const KEY = "chandmani.cart.v1";
const EMPTY: CartItem[] = [];
export const MAX_QTY = 10;

let items: CartItem[] = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();

const same = (i: CartItem, slug: string, opt: string | null) => i.slug === slug && i.opt === opt;

/** Most units of one product / opt a customer can order: stock when tracked, never more than MAX_QTY. */
export function maxQty(slug: string, opt: string | null) {
  const line = resolveLine(slug, opt);
  if (!line) return 0;
  return line.stock == null ? MAX_QTY : Math.min(MAX_QTY, line.stock);
}

const isItem = (x: unknown): x is CartItem => {
  const i = x as CartItem;
  return !!i && typeof i.slug === "string" && (i.opt === null || typeof i.opt === "string") && Number.isInteger(i.qty) && i.qty > 0 && maxQty(i.slug, i.opt) > 0;
};

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const parsed: unknown = JSON.parse(window.localStorage.getItem(KEY) ?? "[]");
    if (Array.isArray(parsed)) items = parsed.filter(isItem).map((i) => ({ slug: i.slug, opt: i.opt, qty: Math.min(i.qty, maxQty(i.slug, i.opt)) }));
  } catch {
    items = EMPTY;
  }
}

function commit(next: CartItem[]) {
  items = next;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* storage blocked: the cart still works for this page view */
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  load();
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key !== KEY) return;
    loaded = false;
    load();
    listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export function useCart() {
  return useSyncExternalStore(
    subscribe,
    () => (load(), items),
    () => EMPTY,
  );
}

export const cart = {
  add(slug: string, opt: string | null, qty = 1) {
    load();
    const cap = maxQty(slug, opt);
    if (cap <= 0) return;
    const has = items.some((i) => same(i, slug, opt));
    commit(has ? items.map((i) => (same(i, slug, opt) ? { ...i, qty: Math.min(cap, i.qty + qty) } : i)) : [...items, { slug, opt, qty: Math.min(cap, qty) }]);
  },
  setQty(slug: string, opt: string | null, qty: number) {
    load();
    const cap = maxQty(slug, opt);
    commit(qty <= 0 ? items.filter((i) => !same(i, slug, opt)) : items.map((i) => (same(i, slug, opt) ? { ...i, qty: Math.min(cap, qty) } : i)));
  },
  clear() {
    commit(EMPTY);
  },
};

export const cartCount = (list: CartItem[]) => list.reduce((n, i) => n + i.qty, 0);
export const cartSubtotal = (list: CartItem[]) => list.reduce((s, i) => s + (resolveLine(i.slug, i.opt)?.price ?? 0) * i.qty, 0);
