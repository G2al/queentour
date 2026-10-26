import Link from "next/link";
import styles from "@/app/components/booking/booking.module.css";
export default function NotFound() { return <main className={styles.page}><section className={styles.empty}><h1>Pratica non trovata o link non valido</h1><p>Verifica di avere aperto il link personale completo oppure accedi con l’agenzia che ha creato la pratica.</p><Link href="/area-agenzie/accedi" className={styles.primary}>Area agenzie</Link></section></main>; }
