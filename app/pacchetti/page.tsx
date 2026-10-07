import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PackageCatalog from "./PackageCatalog";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Pacchetti viaggio | Queen Tour",
  description: "Scopri e filtra i pacchetti viaggio Queen Tour per mare, città, tour e viaggi romantici.",
};

export default function PackagesPage() {
  return (
    <main>
      <section className={styles.hero} aria-labelledby="packages-page-title">
        <div className={styles.heroCopy}>
          <span className={styles.eyebrow}>Pacchetti Queen Tour</span>
          <h1 id="packages-page-title">Il mondo che desideri, organizzato per te.</h1>
          <p>
            Proposte curate, servizi selezionati e assistenza dedicata. Trova il viaggio
            giusto oppure chiedici di personalizzarlo completamente.
          </p>
          <div className={styles.heroActions}>
            <Link href="#catalogo">Esplora i pacchetti</Link>
            <span><strong>6</strong> destinazioni selezionate</span>
          </div>
        </div>

        <div className={styles.heroVisual}>
          <div className={styles.mainImage}>
            <Image src="/images/maldive.jpg" alt="Laguna tropicale alle Maldive" fill priority sizes="(max-width: 760px) 92vw, 48vw" />
          </div>
          <div className={styles.smallImage}>
            <Image src="/images/newyork.jpg" alt="Times Square a New York" fill sizes="180px" />
          </div>
          <div className={styles.heroNote}>
            <span>Assistenza Queen Tour</span>
            <strong>Prima, durante e dopo il viaggio.</strong>
          </div>
        </div>
      </section>

      <PackageCatalog />

      <section className={styles.customTrip} aria-label="Viaggio su misura">
        <div>
          <span>Non trovi quello che cerchi?</span>
          <h2>Costruiamo il tuo viaggio da zero.</h2>
          <p>Partenza, durata, struttura ed esperienze: raccontaci la tua idea e la trasformeremo in una proposta personale.</p>
        </div>
        <a href="https://wa.me/393296430362?text=Ciao%20Queen%20Tour%2C%20vorrei%20creare%20un%20viaggio%20su%20misura." target="_blank" rel="noreferrer">
          Parla con un travel designer
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M14 7l5 5-5 5" /></svg>
        </a>
      </section>
    </main>
  );
}
