import type { TravelPackage } from "@/app/data/travelPackages";
import { money } from "@/lib/format";
import { offerPriceCaption } from "@/lib/offers";
import styles from "./booking.module.css";

export default function PackagePrice({ product }: { product: TravelPackage }) {
  return <div className={styles.price}><strong>{product.price == null ? "Prezzo su richiesta" : `${product.priceBasis === "per_service" ? "" : "da "}${money(product.price, product.currency)}`}</strong>{product.price != null && <small>{offerPriceCaption(product)}</small>}{product.priceBasis === "per_night" && <small>Quota a persona · volo escluso</small>}{product.agencyFee && <details className={styles.fee}><summary>Vedi la tua fee</summary><dl><div><dt>Prezzo pieno</dt><dd>{product.price == null ? "Su richiesta" : money(product.price, product.currency)}</dd></div><div><dt>Fee {product.agencyFee.percent}%</dt><dd>{money(product.agencyFee.amount, product.currency)}</dd></div><div><dt>Netto agenzia</dt><dd>{money(product.agencyFee.netPrice, product.currency)}</dd></div></dl></details>}</div>;
}
