import type { TravelPackage } from "@/app/data/travelPackages";
import styles from "./booking.module.css";

export default function OfferFeatures({ product }: { product: TravelPackage }) {
  if (!product.flightIncluded && !product.flightOptional && !product.transferIncluded) return null;
  return <div className={styles.offerFeatures}>
    {(product.flightIncluded || product.flightOptional) && <span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m3 11 7 2 3 8 2-1-1-7 7-7c2-2-1-4-3-2l-7 7-7-2-1 2Z" /></svg>{product.flightIncluded ? "Volo incluso" : "Volo facoltativo"}</span>}
    {product.transferIncluded && <span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 16V8l2-4h12l2 4v8H4ZM4 10h16M7 16v4M17 16v4M7 13h1M16 13h1" /></svg>Transfer incluso</span>}
  </div>;
}
