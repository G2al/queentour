import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PackageCatalog from "./PackageCatalog";
import { getServerPackageFilters, getServerPackages } from "@/lib/server-api";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Hurghada: hotel, transfer ed escursioni | Queen Tour",
  description: "Scopri le proposte Queen Tour in Egitto: hotel, volo + hotel, trasferimenti privati ed escursioni sul Mar Rosso.",
};

export default async function PackagesPage({ searchParams }: PageProps<"/pacchetti">) {
  const query = await searchParams;
  const read = (key: string) => typeof query[key] === "string" ? query[key] as string : "";
  const selectedFilters = {
    search: read("search"), destination: read("destination"), type: read("type"),
    maxPrice: read("max_price"), days: read("days"), departure: read("departure"),
    board: read("board"), date: read("date"),
  };
  const [packages, filters] = await Promise.all([
    getServerPackages({
      per_page: 100, sort: "recommended", search: selectedFilters.search,
      destination: selectedFilters.destination, type: selectedFilters.type,
      days: selectedFilters.days, departure: selectedFilters.departure,
      board: selectedFilters.board, date: selectedFilters.date, max_price: selectedFilters.maxPrice,
    }),
    getServerPackageFilters(),
  ]);
  return (
    <main>
      <section className={styles.hero} aria-labelledby="packages-page-title">
        <div className={styles.heroCopy}>
          <span className={styles.eyebrow}>Egitto · Hurghada · Su misura</span>
          <h1 id="packages-page-title">
            Il tuo Egitto,
            <span>al resto pensiamo noi.</span>
          </h1>
          <p>
            Hotel, transfer ed escursioni a Hurghada.
            Scegli come vivere il Mar Rosso.
          </p>
          <div className={styles.heroActions}>
            <Link href="#catalogo">Esplora le proposte</Link>
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

      <PackageCatalog key={JSON.stringify(selectedFilters)} initialData={packages} filterOptions={filters} selectedFilters={selectedFilters} />

      <section className={styles.customTrip} aria-label="Egitto su misura">
        <div>
          <span>La tua combinazione ideale</span>
          <h2>Hotel, transfer, escursioni. Scegli tu.</h2>
          <p>Dicci date, numero di ospiti e stile di soggiorno: creeremo una proposta chiara e personalizzata, con i servizi che scegli tu.</p>
        </div>
        <a href="https://wa.me/393296430362?text=Ciao%20Queen%20Tour%2C%20vorrei%20creare%20un%20viaggio%20su%20misura." target="_blank" rel="noreferrer">
          Parla con uno specialista Egitto
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M14 7l5 5-5 5" /></svg>
        </a>
      </section>
    </main>
  );
}
