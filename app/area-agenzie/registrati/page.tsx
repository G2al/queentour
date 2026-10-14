import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentAgency } from "@/lib/server-api";
import RegisterForm from "./RegisterForm";
import styles from "../area.module.css";

export const metadata: Metadata = { title: "Registrazione agenzie | Queen Tour", description: "Registra la tua agenzia e accedi ai prezzi netti Queen Tour." };

export default async function AgencyRegisterPage() {
  if (await getCurrentAgency()) redirect("/area-agenzie/profilo");
  return <main className={styles.page}><section className={styles.hero}><div className={styles.intro}><div><span className={styles.eyebrow}>Diventa partner</span><h1>Porta ai tuoi clienti l’Egitto che conosciamo davvero.</h1><p>La registrazione è immediata. Dopo l’invio potrai consultare le condizioni nette dedicate alle agenzie.</p></div><ul className={styles.benefits}><li><span>✓</span>Attivazione senza attese</li><li><span>✓</span>Netto agenzia e prezzo pubblico</li><li><span>✓</span>Supporto specialistico sull’Egitto</li></ul></div><div className={styles.formPanel}><div className={styles.formHeading}><span>Nuova agenzia</span><h2>Iniziamo a collaborare.</h2><p>I campi segnati come facoltativi possono essere completati anche in seguito.</p></div><RegisterForm /><p className={styles.switch}>Hai già un account? <Link href="/area-agenzie/accedi">Accedi</Link></p></div></section></main>;
}
