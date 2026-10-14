"use client";
import styles from "./error.module.css";
export default function PackagesError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <main className={styles.error}><span>Connessione al catalogo</span><h1>Non riusciamo a caricare le proposte.</h1><p>Controlla che il backend TourFlow sia attivo e riprova.</p><button type="button" onClick={reset}>Riprova ora</button></main>;
}
