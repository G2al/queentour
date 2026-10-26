"use client";
import Link from "next/link";
import { useCart } from "./CartProvider";
import styles from "./CartLink.module.css";
export default function CartLink() {
  const { cart, ready, cartNotice } = useCart();
  return <Link href="/carrello" className={styles.link} aria-label={`Carrello, ${ready ? cart.entries.length : 0} prodotti`}><svg key={cartNotice?.id || "idle"} className={cartNotice ? styles.cartPulse : undefined} viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h2l2 12h12l2-9H6M9 20h.01M18 20h.01" /></svg><span key={`count-${cartNotice?.id || "idle"}`} className={cartNotice ? styles.countPulse : undefined}>{ready ? cart.entries.length : 0}</span></Link>;
}
