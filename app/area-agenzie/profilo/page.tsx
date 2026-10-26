import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentAgency } from "@/lib/server-api";
import ProfileForm from "./ProfileForm";
import styles from "../area.module.css";

export const metadata: Metadata = { title: "Profilo agenzia | Queen Tour", description: "Gestisci i dati della tua agenzia partner Queen Tour." };

export default async function AgencyProfilePage() {
  const user = await getCurrentAgency();
  if (!user) redirect("/area-agenzie/accedi");
  return <main className={styles.profilePage}><section className={styles.profileHero}><div><span className={styles.eyebrow}>Area riservata</span><h1>Ciao, {user.name}.</h1><p>Aggiorna i dati operativi e amministrativi della tua agenzia. Nel catalogo visualizzi i prezzi al pubblico; il dettaglio della fee e del netto è riservato alla tua agenzia.</p></div><span className={styles.companyBadge}>{user.agency.company_name}</span></section><section className={styles.profileForm}><div className={styles.formHeading}><span>Profilo agenzia</span><h2>I tuoi dati.</h2><p>Salveremo soltanto i campi che hai effettivamente modificato.</p></div><ProfileForm user={user} /></section></main>;
}
