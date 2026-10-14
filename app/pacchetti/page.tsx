import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PackageCatalog from "./PackageCatalog";
import { getServerPackageFilters, getServerPackages } from "@/lib/server-api";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Hurghada: hotel, transfer ed escursioni | Queen Tour",
  description: "Scopri i servizi Solo Land Queen Tour a Hurghada: soggiorni in hotel, trasferimenti privati ed escursioni sul Mar Rosso.",
};

export default async function PackagesPage() {
  const [packages, filters] = await Promise.all([
    getServerPackages({ per_page: 100, sort: "recommended" }),
    getServerPackageFilters(),
  ]);
  return (
    <main>
      <section className={styles.hero} aria-labelledby="packages-page-title">
        <div className={styles.heroCopy}>
          <span className={styles.eyebrow}>Egitto · Hurghada · Solo Land</span>
          <h1 id="packages-page-title">Tutto il tuo Egitto, una volta atterrato.</h1>
          <p>
            Hotel selezionati, transfer puntuali ed escursioni autentiche. Componi la
            tua esperienza a Hurghada con servizi chiari e assistenza dedicata.
          </p>
          <div className={styles.heroActions}>
            <Link href="#catalogo">Esplora le proposte</Link>
            <span><strong>3</strong> servizi · volo escluso</span>
          </div>
        </div>

        <div className={styles.heroVisual}>
          <div className={styles.mainImage}>
            <Image src="/images/egypt-hurghada-hero.png" alt="La costa di Hurghada sul Mar Rosso" fill priority sizes="(max-width: 760px) 92vw, 48vw" />
          </div>
          <div className={styles.smallImage}>
            <Image src="/images/egypt-excursion.png" alt="Escursione in barca sul Mar Rosso" fill sizes="180px" />
          </div>
          <div className={styles.heroNote}>
            <span>Specialisti di Hurghada</span>
            <strong>Conosciamo l’Egitto che proponiamo.</strong>
          </div>
        </div>
      </section>

      <PackageCatalog initialData={packages} filterOptions={filters} />

      <section className={styles.customTrip} aria-label="Egitto su misura">
        <div>
          <span>La tua combinazione ideale</span>
          <h2>Hotel, transfer, escursioni. Scegli tu.</h2>
          <p>Dicci date, numero di ospiti e stile di soggiorno: creeremo una proposta Solo Land chiara, personalizzata e senza servizi superflui.</p>
        </div>
        <a href="https://wa.me/393296430362?text=Ciao%20Queen%20Tour%2C%20vorrei%20creare%20un%20viaggio%20su%20misura." target="_blank" rel="noreferrer">
          Parla con uno specialista Egitto
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M14 7l5 5-5 5" /></svg>
        </a>
      </section>
    </main>
  );
}
