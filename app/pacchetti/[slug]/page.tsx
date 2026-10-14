import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { PackagePeriod, TravelPackage } from "@/app/data/travelPackages";
import { ApiError } from "@/lib/api";
import { getServerPackage } from "@/lib/server-api";
import ItinerarySteps from "./ItinerarySteps";
import styles from "./page.module.css";

const formatPrice = (value: number, currency = "EUR") => new Intl.NumberFormat("it-IT", { style: "currency", currency, maximumFractionDigits: 0 }).format(value);
const unitLabel = (item: TravelPackage) => item.priceUnit === "per_service" ? "a servizio" : "a persona";
const formatDate = (value: string) => new Intl.DateTimeFormat("it-IT", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(`${value}T12:00:00`));

async function loadPackage(slug: string) {
  try { return await getServerPackage(slug); }
  catch (error) { if (error instanceof ApiError && error.status === 404) notFound(); throw error; }
}

export async function generateMetadata({ params }: PageProps<"/pacchetti/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  try {
    const item = await loadPackage(slug);
    return { title: `${item.title} | Queen Tour`, description: item.description };
  } catch { return {}; }
}

function PeriodPrice({ label, net, gross, currency, agency }: { label: string; net: number | null; gross?: number | null; currency: string; agency: boolean }) {
  if (net === null) return null;
  return <div className={styles.tariff}><span>{label}</span><strong>{formatPrice(net, currency)}</strong>{agency && gross != null && <small>Pubblico {formatPrice(gross, currency)}</small>}</div>;
}

function PriceList({ periods, travelPackage }: { periods: PackagePeriod[]; travelPackage: TravelPackage }) {
  const agency = travelPackage.priceType === "net";
  return <section className={styles.block}><span className={styles.sectionEyebrow}>Listino</span><h2>Periodi e quote disponibili</h2><p className={styles.priceListIntro}>{agency ? "Le quote principali sono i netti riservati alla tua agenzia; sotto trovi anche il prezzo al pubblico." : "Quote a partire da, soggette a disponibilità e conferma."}</p><div className={styles.periods}>{periods.map((period) => <article className={styles.periodCard} key={period.id}><header><div><span>{period.name}</span><strong>{formatDate(period.startDate)} — {formatDate(period.endDate)}</strong></div>{agency && <em>Netto agenzia</em>}</header><div className={styles.tariffs}><PeriodPrice label={travelPackage.priceUnit === "per_service" ? "Servizio" : "Adulto"} net={period.adultPrice} gross={period.adultPriceGross} currency={travelPackage.currency} agency={agency} />{travelPackage.priceUnit === "per_person" && <><PeriodPrice label="3°/4° letto adulto" net={period.extraBedAdultPrice} gross={period.extraBedAdultPriceGross} currency={travelPackage.currency} agency={agency} /><PeriodPrice label="Bambino" net={period.childPrice} gross={period.childPriceGross} currency={travelPackage.currency} agency={agency} /><PeriodPrice label="Infant" net={period.infantPrice} gross={period.infantPriceGross} currency={travelPackage.currency} agency={agency} /><PeriodPrice label="Supplemento singola" net={period.singleSupplement} gross={period.singleSupplementGross} currency={travelPackage.currency} agency={agency} /></>}</div></article>)}</div></section>;
}

export default async function PackageDetailPage({ params }: PageProps<"/pacchetti/[slug]">) {
  const { slug } = await params;
  const travelPackage = await loadPackage(slug);
  const whatsappUrl = `https://wa.me/393296430362?text=${encodeURIComponent(`Ciao Queen Tour, vorrei ricevere una proposta Solo Land per ${travelPackage.title}.`)}`;
  const descriptionParagraphs = travelPackage.longDescription.split(/\n\s*\n/).filter(Boolean);

  return <main className={styles.pageEnter}>
    <section className={styles.hero}>
      <div className={styles.imageWrap}><Image src={travelPackage.image} alt={travelPackage.title} fill priority sizes="(max-width: 760px) 92vw, 55vw" />{travelPackage.badge && <span className={styles.imageBadge}>{travelPackage.badge}</span>}</div>
      <div className={styles.heroContent}>
        <nav className={styles.breadcrumb} aria-label="Percorso"><Link href="/">Home</Link><span>/</span><Link href="/pacchetti">Egitto</Link><span>/</span><span>{travelPackage.destination}</span></nav>
        <span className={styles.eyebrow}>{travelPackage.type} · {travelPackage.country}</span>
        <h1>{travelPackage.title}</h1>
        <p className={styles.location}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s6-5.1 6-11a6 6 0 1 0-12 0c0 5.9 6 11 6 11Z" /><circle cx="12" cy="10" r="2" /></svg>{travelPackage.location}</p>
        <div className={styles.description}>{descriptionParagraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
        <div className={styles.quickFacts}>
          <div><span>Durata</span><strong>{travelPackage.days === 1 ? "Esperienza giornaliera" : `${travelPackage.days} giorni / ${travelPackage.nights} notti`}</strong></div>
          {travelPackage.period && <div><span>Periodo</span><strong>{travelPackage.period}</strong></div>}
          {travelPackage.departures.length > 0 && <div><span>Punto di incontro</span><strong>{travelPackage.departures.join(", ")}</strong></div>}
          {travelPackage.stay && <div><span>Sistemazione</span><strong>{travelPackage.stay}</strong></div>}
        </div>
        <div className={styles.priceRow}><div><span>{travelPackage.priceType === "net" ? "Prezzo netto agenzia" : "A partire da"}</span><strong>{travelPackage.price === null ? "Prezzo su richiesta" : formatPrice(travelPackage.price, travelPackage.currency)}</strong>{travelPackage.price !== null && <small>{unitLabel(travelPackage)}</small>}{travelPackage.priceType === "net" && travelPackage.priceGross != null && <small className={styles.publicPrice}>Prezzo al pubblico {formatPrice(travelPackage.priceGross, travelPackage.currency)}</small>}</div></div>
      </div>
    </section>

    <div className={styles.pageGrid}>
      <div className={styles.mainContent}>
        {travelPackage.highlights.length > 0 && <section className={styles.block}><span className={styles.sectionEyebrow}>I punti forti</span><h2>Il meglio dell’esperienza</h2><div className={styles.highlights}>{travelPackage.highlights.map((highlight, index) => <div key={highlight}><span>{String(index + 1).padStart(2, "0")}</span><strong>{highlight}</strong></div>)}</div></section>}
        {travelPackage.itinerary.length > 0 && <section className={styles.block}><span className={styles.sectionEyebrow}>Programma indicativo</span><h2>L’esperienza, passo dopo passo</h2><ItinerarySteps items={travelPackage.itinerary} /></section>}
        {travelPackage.periods && travelPackage.periods.length > 0 && <PriceList periods={travelPackage.periods} travelPackage={travelPackage} />}
        {(travelPackage.included.length > 0 || travelPackage.excluded.length > 0) && <section className={`${styles.block} ${styles.servicesBlock}`}>
          {travelPackage.included.length > 0 && <div><span className={styles.sectionEyebrow}>Incluso</span><h2>Compreso nella proposta</h2><ul className={styles.included}>{travelPackage.included.map((item) => <li key={item}><span>✓</span>{item}</li>)}</ul></div>}
          {travelPackage.excluded.length > 0 && <div><span className={styles.sectionEyebrow}>Non incluso</span><h2>Da considerare a parte</h2><ul className={styles.excluded}>{travelPackage.excluded.map((item) => <li key={item}><span>–</span>{item}</li>)}</ul></div>}
        </section>}
        {(travelPackage.cancellationPolicy || travelPackage.notes) && <section className={styles.block}><span className={styles.sectionEyebrow}>Informazioni utili</span><h2>Prima di partire</h2><div className={styles.policy}>{travelPackage.cancellationPolicy && <div><h3>Politica di cancellazione</h3>{travelPackage.cancellationPolicy.split("\n").map((line) => <p key={line}>{line}</p>)}</div>}{travelPackage.notes && <div><h3>Note</h3><p>{travelPackage.notes}</p></div>}</div></section>}
      </div>

      <aside className={styles.sidebar}><span className={styles.sidebarEyebrow}>Richiedi la tua proposta</span><h2>Personalizziamo il tuo Egitto.</h2><p>Indicaci date, hotel o volo di arrivo e numero di ospiti. Ti risponderemo con una proposta Solo Land su misura.</p><dl>{travelPackage.board && <div><dt>Trattamento</dt><dd>{travelPackage.board}</dd></div>}{travelPackage.months.length > 0 && <div><dt>Disponibilità</dt><dd>{travelPackage.months.join(", ")}</dd></div>}<div><dt>Formula</dt><dd>Solo Land · volo escluso</dd></div></dl><a href={whatsappUrl} target="_blank" rel="noreferrer">Richiedi preventivo<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M14 7l5 5-5 5" /></svg></a><small>Prezzo indicativo soggetto a disponibilità e conferma.</small></aside>
    </div>
    <section className={styles.morePackages}><div><span>Continua a esplorare</span><h2>Altre esperienze in Egitto</h2></div><Link href="/pacchetti">Torna a tutte le proposte <span>→</span></Link></section>
  </main>;
}
