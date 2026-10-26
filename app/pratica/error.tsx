"use client";
import styles from "@/app/components/booking/booking.module.css";
export default function ErrorPage({ reset }: { reset: () => void }) { return <main className={styles.page}><div className={styles.error}>Non è possibile caricare la pratica in questo momento.<button type="button" className={styles.secondary} onClick={reset}>Riprova</button></div></main>; }
