import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { PackagePeriod, TravelPackage } from "@/app/data/travelPackages";
import { ApiError } from "@/lib/api";
import { getServerPackage } from "@/lib/server-api";
import ItinerarySteps from "./ItinerarySteps";
import styles from "./page.module.css";
import PackagePrice from "@/app/components/booking/PackagePrice";
import BookingConfigurator from "@/app/components/booking/BookingConfigurator";
import { money, italianDate } from "@/lib/format";

const formatPrice = money;
const formatDate = italianDate;

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

function PeriodPrice({ label, amount, currency, fallback }: { label: string; amount: number | null; currency: string; fallback: string }) {
  return <div className={styles.tariff}><span>{label}</span><strong>{amount == null ? fallback : formatPrice(amount, currency)}</strong></div>;
}

function PriceList({ periods, travelPackage }: { periods: PackagePeriod[]; travelPackage: TravelPackage }) {
  return <section className={styles.block}><span className={styles.sectionEyebrow}>Listino al pubblico</span><h2>Periodi e quote disponibili</h2><p className={styles.priceListIntro}>{travelPackage.type === "Soggiorno" ? "Quote a persona a notte. Il totale del soggiorno, con eventuali supplementi e volo, viene verificato nel configuratore." : travelPackage.priceUnit === "per_service" ? "Quota unica a servizio per il gruppo." : "Quote a persona per il servizio."}</p><div className={styles.periods}>{periods.map((period) => <article className={styles.periodCard} key={period.id}><header><div><span>{period.name}</span><strong>{formatDate(period.startDate)} — {formatDate(period.endDate)}</strong></div></header><div className={styles.tariffs}><PeriodPrice label={travelPackage.priceUnit === "per_service" ? "Servizio" : "Adulto"} amount={period.adultPrice} currency={travelPackage.currency} fallback="Su richiesta" />{travelPackage.priceUnit === "per_person" && <><PeriodPrice label="3°/4° letto adulto" amount={period.extraBedAdultPrice} currency={travelPackage.currency} fallback="Quota base" /><PeriodPrice label="Bambino" amount={period.childPrice} currency={travelPackage.currency} fallback="Quota base" /><PeriodPrice label="Infant" amount={period.infantPrice} currency={travelPackage.currency} fallback="Gratuito" /><PeriodPrice label="Supplemento singola" amount={period.singleSupplement} currency={travelPackage.currency} fallback="Non previsto" /></>}</div></article>)}</div></section>;
}

export default async function PackageDetailPage({ params }: PageProps<"/pacchetti/[slug]">) {
  const { slug } = await params;
  const travelPackage = await loadPackage(slug);
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
        <div className={styles.packagePrice}><PackagePrice product={travelPackage} /></div>
      </div>
    </section>

    <div className={styles.pageGrid}>
      <div className={styles.mainContent}>
        {travelPackage.gallery && travelPackage.gallery.length > 0 && <section className={styles.block}><span className={styles.sectionEyebrow}>La proposta in immagini</span><div className={styles.gallery}>{travelPackage.gallery.map((src, index) => <a href={src} key={`${src}-${index}`} target="_blank" rel="noreferrer"><Image src={src} alt={`${travelPackage.title} · foto ${index + 1}`} width={500} height={340} /></a>)}</div></section>}
        {travelPackage.hotel && <section className={styles.block}><span className={styles.sectionEyebrow}>Il tuo hotel</span><h2>{travelPackage.hotel.name}</h2><p className={styles.priceListIntro}>{travelPackage.hotel.address}</p><p className={styles.priceListIntro}>{travelPackage.hotel.description}</p><div className={styles.highlights}>{travelPackage.hotel.amenities.map((amenity) => <div key={amenity}><strong>{amenity}</strong></div>)}</div></section>}
        {travelPackage.highlights.length > 0 && <section className={styles.block}><span className={styles.sectionEyebrow}>I punti forti</span><h2>Il meglio dell’esperienza</h2><div className={styles.highlights}>{travelPackage.highlights.map((highlight, index) => <div key={highlight}><span>{String(index + 1).padStart(2, "0")}</span><strong>{highlight}</strong></div>)}</div></section>}
        {travelPackage.itinerary.length > 0 && <section className={styles.block}><span className={styles.sectionEyebrow}>Programma indicativo</span><h2>L’esperienza, passo dopo passo</h2><ItinerarySteps items={travelPackage.itinerary} /></section>}
        {travelPackage.periods && travelPackage.periods.length > 0 && <PriceList periods={travelPackage.periods} travelPackage={travelPackage} />}
        {(travelPackage.included.length > 0 || travelPackage.excluded.length > 0) && <section className={`${styles.block} ${styles.servicesBlock}`}>
          {travelPackage.included.length > 0 && <div><span className={styles.sectionEyebrow}>Incluso</span><h2>Compreso nella proposta</h2><ul className={styles.included}>{travelPackage.included.map((item) => <li key={item}><span>✓</span>{item}</li>)}</ul></div>}
          {travelPackage.excluded.length > 0 && <div><span className={styles.sectionEyebrow}>Non incluso</span><h2>Da considerare a parte</h2><ul className={styles.excluded}>{travelPackage.excluded.map((item) => <li key={item}><span>–</span>{item}</li>)}</ul></div>}
        </section>}
        {(travelPackage.cancellationPolicy || travelPackage.notes) && <section className={styles.block}><span className={styles.sectionEyebrow}>Informazioni utili</span><h2>Prima di partire</h2><div className={styles.policy}>{travelPackage.cancellationPolicy && <div><h3>Politica di cancellazione</h3>{travelPackage.cancellationPolicy.split("\n").map((line) => <p key={line}>{line}</p>)}</div>}{travelPackage.notes && <div><h3>Note</h3><p>{travelPackage.notes}</p></div>}</div></section>}
      </div>

      <aside className={styles.sidebar}><BookingConfigurator product={travelPackage} /></aside>
    </div>
    <section className={styles.morePackages}><div><span>Continua a esplorare</span><h2>Altre esperienze in Egitto</h2></div><Link href="/pacchetti">Torna a tutte le proposte <span>→</span></Link></section>
  </main>;
}
