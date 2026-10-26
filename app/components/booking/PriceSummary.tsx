import type { QuotedInsurance, Totals } from "@/lib/booking-types";
import { money } from "@/lib/format";
import styles from "./booking.module.css";

export default function PriceSummary({ totals, currency = "EUR", insurances = [] }: { totals: Totals; currency?: string; insurances?: QuotedInsurance[] }) {
  return <><dl className={styles.summary}><div><dt>Servizi</dt><dd>{money(totals.items, currency)}</dd></div>{insurances.map((insurance, index) => <div key={index}><dt>{insurance.name} · {insurance.quantity} persone</dt><dd>{money(insurance.total, currency)}</dd></div>)}{!insurances.length && totals.insurances > 0 && <div><dt>Assicurazioni</dt><dd>{money(totals.insurances, currency)}</dd></div>}{totals.priceLock > 0 && <div><dt>Blocca prezzo</dt><dd>{money(totals.priceLock, currency)}</dd></div>}</dl><div className={styles.total}><span>Totale</span><strong>{money(totals.total, currency)}</strong></div>{totals.feePercent != null && <details className={styles.fee}><summary>Dettaglio riservato agenzia</summary><dl><div><dt>Fee {totals.feePercent}%</dt><dd>{money(totals.feeAmount, currency)}</dd></div><div><dt>Da versare a Queen Tour</dt><dd>{money(totals.amountDue, currency)}</dd></div></dl></details>}<div className={styles.notice}>Acconto alla conferma ({totals.depositPercent}%): <strong>{money(totals.depositAmount, currency)}</strong><br />Nessun pagamento online.</div></>;
}
