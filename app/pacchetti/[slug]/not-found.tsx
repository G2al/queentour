import Link from "next/link";
import styles from "./not-found.module.css";

export default function PackageNotFound() {
  return <main className={styles.page}><span>404 · Proposta non disponibile</span><h1>Questo pacchetto non è più nel catalogo.</h1><p>Potrebbe essere scaduto, non ancora pubblicato oppure l’indirizzo non è corretto.</p><Link href="/pacchetti">Torna a tutte le proposte</Link></main>;
}
