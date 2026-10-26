"use client";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import Link from "next/link";
import styles from "./CartLink.module.css";
import { usePathname } from "next/navigation";
import type { CartState } from "@/lib/booking-types";
import { CART_KEY, EMPTY_CART, readCart } from "@/lib/cart";
import type { AgencyUser } from "@/app/data/travelPackages";

type CartNotice = { id: string; title: string; updated: boolean };
type CartContextValue = { cart: CartState; setCart: (cart: CartState) => void; ready: boolean; storageError: string; agency: boolean | null; sessionVersion: number; cartNotice: CartNotice | null; notifyCart: (title: string, updated: boolean) => void };
const CartContext = createContext<CartContextValue | null>(null);
export function CartProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [cart, updateCart] = useState<CartState>(EMPTY_CART);
  const [ready, setReady] = useState(false);
  const [storageError, setStorageError] = useState("");
  const [agency, setAgency] = useState<boolean | null>(null);
  const [sessionVersion, setSessionVersion] = useState(0);
  const [cartNotice, setCartNotice] = useState<CartNotice | null>(null);
  useEffect(() => {
    if (!cartNotice) return;
    const timer = window.setTimeout(() => setCartNotice(null), 5500);
    return () => window.clearTimeout(timer);
  }, [cartNotice]);
  useEffect(() => {
    try { updateCart(readCart(localStorage.getItem(CART_KEY))); } catch { setStorageError("Non è stato possibile recuperare il carrello salvato. Puoi crearne uno nuovo."); }
    setReady(true);
    const sync = (event: StorageEvent) => { if (event.key === CART_KEY) { try { updateCart(readCart(event.newValue)); } catch { setStorageError("Il carrello di un’altra scheda non è valido. Ricarica la pagina."); } } };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);
  useEffect(() => {
    let cancelled = false;
    fetch("/api/auth/me", { cache: "no-store" }).then(async (response) => {
      if (cancelled) return;
      if (response.ok) { const result: { data: AgencyUser } = await response.json(); if (!cancelled) setAgency(result.data.role === "agency"); }
      else if (response.status === 401) setAgency(false);
    }).catch(() => { /* La tariffa e l'identità rimangono quelle verificate dal server. */ });
    return () => { cancelled = true; };
  }, [pathname, sessionVersion]);
  useEffect(() => {
    const expire = () => { setAgency(false); setSessionVersion((version) => version + 1); };
    window.addEventListener("agency-session-expired", expire);
    const refresh = () => setSessionVersion((version) => version + 1);
    window.addEventListener("focus", refresh);
    return () => { window.removeEventListener("agency-session-expired", expire); window.removeEventListener("focus", refresh); };
  }, []);
  const setCart = (next: CartState) => {
    updateCart(next);
    try { localStorage.setItem(CART_KEY, JSON.stringify(next)); setStorageError(""); }
    catch { setStorageError("Il browser non consente di salvare il carrello: resterà disponibile soltanto in questa sessione."); }
  };
  const notifyCart = (title: string, updated: boolean) => setCartNotice({ id: crypto.randomUUID(), title, updated });
  return <CartContext.Provider value={{ cart, setCart, ready, storageError, agency, sessionVersion, cartNotice, notifyCart }}>{children}<div className={styles.noticeRegion} role="status" aria-live="polite" aria-atomic="true">{cartNotice && <div className={styles.toast} key={cartNotice.id}><span className={styles.checkmark} aria-hidden="true"><svg viewBox="0 0 24 24"><path d="m5 12 4 4 10-10" /></svg></span><div><strong>{cartNotice.updated ? "Carrello aggiornato" : "Aggiunto al carrello"}</strong><p>{cartNotice.title}</p><Link href="/carrello" onClick={() => setCartNotice(null)}>Vai al carrello →</Link></div><button type="button" onClick={() => setCartNotice(null)} aria-label="Chiudi conferma carrello">×</button></div>}</div></CartContext.Provider>;
}
export function useCart() { const context = useContext(CartContext); if (!context) throw new Error("CartProvider mancante"); return context; }
