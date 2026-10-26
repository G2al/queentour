"use client";
import type { StoredItem } from "@/lib/booking-types";
import type { TravelPackage } from "@/app/data/travelPackages";
import { useResource } from "./useResources";
import BookingConfigurator from "./BookingConfigurator";
import styles from "./booking.module.css";

export default function CartItemEditor({ entry, onClose }: { entry: StoredItem; onClose: () => void }) {
  const product = useResource<TravelPackage>(`packages/${encodeURIComponent(entry.product.slug)}`);
  return <section className={styles.panel}><div className={styles.row}><h2>Modifica {entry.product.title}</h2><button type="button" onClick={onClose} className={styles.secondary}>Chiudi</button></div>{product.error ? <div className={styles.error}>{product.error}<button type="button" onClick={product.retry} className={styles.secondary}>Riprova</button></div> : product.data ? <BookingConfigurator product={product.data} editing={entry} onSaved={onClose} /> : <p className={styles.loading}>Caricamento disponibilità aggiornata…</p>}</section>;
}
