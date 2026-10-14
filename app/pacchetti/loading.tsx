import styles from "./loading.module.css";

export default function PackagesLoading() {
  return <main className={styles.loading} aria-label="Caricamento pacchetti"><div className={styles.hero} /><div className={styles.heading} /><div className={styles.layout}><div className={styles.filters} /><div className={styles.cards}>{Array.from({ length: 4 }, (_, index) => <div className={styles.card} key={index} />)}</div></div></main>;
}
