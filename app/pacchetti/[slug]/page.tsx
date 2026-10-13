import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTravelPackage, travelPackages } from "@/app/data/travelPackages";
import ItinerarySteps from "./ItinerarySteps";
import styles from "./page.module.css";

export function generateStaticParams() {
  return travelPackages.map((travelPackage) => ({ slug: travelPackage.slug }));
}

export async function generateMetadata({ params }: PageProps<"/pacchetti/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const travelPackage = getTravelPackage(slug);

  if (!travelPackage) return {};

  return {
    title: `${travelPackage.title} | Queen Tour`,
    description: travelPackage.description,
  };
}

export default async function PackageDetailPage({ params }: PageProps<"/pacchetti/[slug]">) {
  const { slug } = await params;
  const travelPackage = getTravelPackage(slug);

  if (!travelPackage) notFound();

  const whatsappUrl = `https://wa.me/393296430362?text=${encodeURIComponent(
    `Ciao Queen Tour, vorrei ricevere una proposta Solo Land per ${travelPackage.title}.`,
  )}`;

  return (
    <main className={styles.pageEnter}>
      <section className={styles.hero}>
        <div className={styles.imageWrap}>
          <Image src={travelPackage.image} alt={travelPackage.title} fill priority sizes="(max-width: 760px) 92vw, 55vw" />
          <span className={styles.imageBadge}>{travelPackage.badge}</span>
        </div>

        <div className={styles.heroContent}>
          <nav className={styles.breadcrumb} aria-label="Percorso">
            <Link href="/">Home</Link><span>/</span><Link href="/pacchetti">Egitto</Link><span>/</span><span>{travelPackage.destination}</span>
          </nav>
          <span className={styles.eyebrow}>{travelPackage.type} · {travelPackage.country}</span>
          <h1>{travelPackage.title}</h1>
          <p className={styles.location}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s6-5.1 6-11a6 6 0 1 0-12 0c0 5.9 6 11 6 11Z" /><circle cx="12" cy="10" r="2" /></svg>
            {travelPackage.location}
          </p>
          <p className={styles.description}>{travelPackage.longDescription}</p>

          <div className={styles.quickFacts}>
            <div><span>Durata</span><strong>{travelPackage.days === 1 ? "Esperienza giornaliera" : `${travelPackage.days} giorni / ${travelPackage.nights} notti`}</strong></div>
            <div><span>Periodo</span><strong>{travelPackage.period}</strong></div>
            <div><span>Punto di incontro</span><strong>{travelPackage.departures.join(", ")}</strong></div>
            <div><span>Sistemazione</span><strong>{travelPackage.stay}</strong></div>
          </div>

          <div className={styles.priceRow}>
            <div><span>A partire da</span><strong>€ {travelPackage.price.toLocaleString("it-IT")}</strong><small>{travelPackage.type === "Transfer" ? "a servizio" : "per persona"}</small></div>
            <span className={styles.rating}>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3Z" /></svg>
              {travelPackage.rating.toFixed(1)} · {travelPackage.reviews} recensioni
            </span>
          </div>
        </div>
      </section>

      <div className={styles.pageGrid}>
        <div className={styles.mainContent}>
          <section className={styles.block}>
            <span className={styles.sectionEyebrow}>I punti forti</span>
            <h2>Il meglio dell’esperienza</h2>
            <div className={styles.highlights}>
              {travelPackage.highlights.map((highlight, index) => (
                <div key={highlight}><span>0{index + 1}</span><strong>{highlight}</strong></div>
              ))}
            </div>
          </section>

          <section className={styles.block}>
            <span className={styles.sectionEyebrow}>Programma indicativo</span>
            <h2>L’esperienza, passo dopo passo</h2>
            <ItinerarySteps items={travelPackage.itinerary} />
          </section>

          <section className={`${styles.block} ${styles.servicesBlock}`}>
            <div>
              <span className={styles.sectionEyebrow}>Incluso</span>
              <h2>Compreso nella proposta</h2>
              <ul className={styles.included}>
                {travelPackage.included.map((item) => <li key={item}><span>✓</span>{item}</li>)}
              </ul>
            </div>
            <div>
              <span className={styles.sectionEyebrow}>Non incluso</span>
              <h2>Da considerare a parte</h2>
              <ul className={styles.excluded}>
                {travelPackage.excluded.map((item) => <li key={item}><span>–</span>{item}</li>)}
              </ul>
            </div>
          </section>
        </div>

        <aside className={styles.sidebar}>
          <span className={styles.sidebarEyebrow}>Richiedi la tua proposta</span>
          <h2>Personalizziamo il tuo Egitto.</h2>
          <p>Indicaci date, hotel o volo di arrivo e numero di ospiti. Ti risponderemo con una proposta Solo Land su misura.</p>
          <dl>
            <div><dt>Trattamento</dt><dd>{travelPackage.board}</dd></div>
            <div><dt>Disponibilità</dt><dd>{travelPackage.months.join(", ")}</dd></div>
            <div><dt>Formula</dt><dd>Solo Land · volo escluso</dd></div>
          </dl>
          <a href={whatsappUrl} target="_blank" rel="noreferrer">
            Richiedi preventivo
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M14 7l5 5-5 5" /></svg>
          </a>
          <small>Prezzo indicativo soggetto a disponibilità e conferma.</small>
        </aside>
      </div>

      <section className={styles.morePackages}>
        <div><span>Continua a esplorare</span><h2>Altre esperienze in Egitto</h2></div>
        <Link href="/pacchetti">Torna a tutte le proposte <span>→</span></Link>
      </section>
    </main>
  );
}
