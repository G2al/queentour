"use client";
import styles from "@/app/components/booking/booking.module.css";
export default function ErrorPage({ reset }: { reset: () => void }) { return <main className={styles.page}><p className={styles.error}>Non è possibile caricare il documento.<button className={styles.secondary} type="button" onClick={reset}>Riprova</button></p></main>; }
