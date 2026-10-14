import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentAgency } from "@/lib/server-api";
import LoginForm from "./LoginForm";
import styles from "../area.module.css";

export const metadata: Metadata = { title: "Accesso area agenzie | Queen Tour", description: "Accedi all'area riservata alle agenzie partner Queen Tour." };

export default async function AgencyLoginPage() {
  if (await getCurrentAgency()) redirect("/area-agenzie/profilo");
  return <main className={styles.page}><section className={styles.hero}><div className={styles.intro}><div><span className={styles.eyebrow}>Queen Tour per le agenzie</span><h1>Il tuo Egitto, con condizioni dedicate.</h1><p>Accedi per consultare il catalogo con i prezzi netti riservati alla tua agenzia e confrontarli con il prezzo al pubblico.</p></div><ul className={styles.benefits}><li><span>✓</span>Prezzi netti sempre aggiornati</li><li><span>✓</span>Catalogo Solo Land completo</li><li><span>✓</span>Contatto diretto con il nostro team</li></ul></div><div className={styles.formPanel}><div className={styles.formHeading}><span>Area riservata</span><h2>Bentornato.</h2><p>Inserisci le credenziali della tua agenzia.</p></div><LoginForm /><p className={styles.switch}>Non sei ancora partner? <Link href="/area-agenzie/registrati">Registra la tua agenzia</Link></p></div></section></main>;
}
