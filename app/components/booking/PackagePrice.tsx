import type { TravelPackage } from "@/app/data/travelPackages";
import { money } from "@/lib/format";
import styles from "./booking.module.css";

export default function PackagePrice({ product }: { product: TravelPackage }) {
  return <div className={styles.price}><span>A partire da</span><strong>{product.price == null ? "Prezzo su richiesta" : money(product.price, product.currency)}</strong>{product.price != null && <small>{product.priceUnit === "per_service" ? "a servizio" : product.type === "Soggiorno" ? `a persona · ${product.nights} notti` : "a persona"}</small>}{product.type === "Soggiorno" && product.pricePerNight != null && <small>da {money(product.pricePerNight, product.currency)} a persona a notte</small>}{product.agencyFee && <details className={styles.fee}><summary>Vedi la tua fee</summary><dl><div><dt>Prezzo pieno</dt><dd>{product.price == null ? "Su richiesta" : money(product.price, product.currency)}</dd></div><div><dt>Fee {product.agencyFee.percent}%</dt><dd>{money(product.agencyFee.amount, product.currency)}</dd></div><div><dt>Netto agenzia</dt><dd>{money(product.agencyFee.netPrice, product.currency)}</dd></div></dl></details>}</div>;
}
