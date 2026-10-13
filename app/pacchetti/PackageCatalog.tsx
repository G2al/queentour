"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { travelPackages } from "@/app/data/travelPackages";
import styles from "./PackageCatalog.module.css";

const destinations = [...new Set(travelPackages.map((item) => item.destination))];
const meetingPoints = [...new Set(travelPackages.flatMap((item) => item.departures))];

const initialFilters = {
  search: "",
  destination: "Tutte",
  type: "Tutte",
  maxPrice: "Tutti",
  duration: "Tutte",
  departure: "Tutti",
  board: "Tutti",
};

export default function PackageCatalog() {
  const [filters, setFilters] = useState(initialFilters);
  const [sort, setSort] = useState("consigliati");
  const [advancedOpen, setAdvancedOpen] = useState(false);

  const updateFilter = (key: keyof typeof filters, value: string) => {
    setFilters((current) => ({ ...current, [key]: value }));
  };

  const filteredPackages = useMemo(() => {
    const search = filters.search.trim().toLocaleLowerCase("it");
    const maxPrice = filters.maxPrice === "Tutti" ? Infinity : Number(filters.maxPrice);

    const matches = travelPackages.filter((travelPackage) => {
      const searchable = `${travelPackage.title} ${travelPackage.destination} ${travelPackage.country} ${travelPackage.location}`.toLocaleLowerCase("it");
      const durationMatches =
        filters.duration === "Tutte" ||
        (filters.duration === "breve" && travelPackage.days <= 6) ||
        (filters.duration === "media" && travelPackage.days >= 7 && travelPackage.days <= 9) ||
        (filters.duration === "lunga" && travelPackage.days >= 10);

      return (
        (!search || searchable.includes(search)) &&
        (filters.destination === "Tutte" || travelPackage.destination === filters.destination) &&
        (filters.type === "Tutte" || travelPackage.type === filters.type) &&
        travelPackage.price <= maxPrice &&
        durationMatches &&
        (filters.departure === "Tutti" || travelPackage.departures.includes(filters.departure)) &&
        (filters.board === "Tutti" || travelPackage.board.includes(filters.board))
      );
    });

    return [...matches].sort((first, second) => {
      if (sort === "prezzo-crescente") return first.price - second.price;
      if (sort === "prezzo-decrescente") return second.price - first.price;
      if (sort === "durata") return first.days - second.days;
      if (sort === "valutazione") return second.rating - first.rating;
      return second.reviews - first.reviews;
    });
  }, [filters, sort]);

  const activeFilters = Object.entries(filters).filter(
    ([key, value]) => value !== initialFilters[key as keyof typeof initialFilters],
  ).length;

  return (
    <section className={styles.catalog} id="catalogo" aria-labelledby="catalog-title">
      <div className={styles.headingRow}>
        <div>
          <span className={styles.eyebrow}>Queen Tour · Egitto</span>
          <h2 id="catalog-title">Costruisci la tua Hurghada</h2>
        </div>
        <p>Combina soggiorno, trasferimento ed escursioni. Il volo resta sempre escluso.</p>
      </div>

      <button
        className={`${styles.mobileFilterToggle} ${advancedOpen ? styles.mobileFilterToggleOpen : ""}`}
        type="button"
        onClick={() => setAdvancedOpen((open) => !open)}
        aria-expanded={advancedOpen}
        aria-controls="package-filter-panel"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M7 12h10M10 17h4" /></svg>
        Filtra i servizi
        {activeFilters > 0 && <span>{activeFilters}</span>}
      </button>

      <div className={styles.catalogLayout}>
        <aside className={`${styles.filterPanel} ${advancedOpen ? styles.filterPanelOpen : ""}`} id="package-filter-panel">
          <div className={styles.filterHeading}>
            <div>
              <span>La tua vacanza in Egitto</span>
              <h3>Filtra i servizi</h3>
            </div>
            {activeFilters > 0 && <span className={styles.activeCount}>{activeFilters}</span>}
          </div>

          <label className={styles.field}>
            <span>Cerca</span>
            <div className={styles.inputWrap}>
              <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 4 4" /></svg>
              <input value={filters.search} onChange={(event) => updateFilter("search", event.target.value)} placeholder="Hurghada, hotel, escursione..." type="search" />
            </div>
          </label>

          <label className={styles.field}>
            <span>Destinazione</span>
            <select value={filters.destination} onChange={(event) => updateFilter("destination", event.target.value)}>
              <option>Tutte</option>
              {destinations.map((destination) => <option key={destination}>{destination}</option>)}
            </select>
          </label>

          <label className={styles.field}>
            <span>Tipologia</span>
            <select value={filters.type} onChange={(event) => updateFilter("type", event.target.value)}>
              <option>Tutte</option><option>Soggiorno</option><option>Transfer</option><option>Escursione</option>
            </select>
          </label>

          <label className={styles.field}>
            <span>Budget massimo</span>
            <select value={filters.maxPrice} onChange={(event) => updateFilter("maxPrice", event.target.value)}>
              <option value="Tutti">Qualsiasi</option><option value="100">Fino a € 100</option><option value="500">Fino a € 500</option><option value="700">Fino a € 700</option><option value="1000">Fino a € 1.000</option>
            </select>
          </label>

          <label className={styles.field}>
            <span>Durata</span>
            <select value={filters.duration} onChange={(event) => updateFilter("duration", event.target.value)}>
              <option value="Tutte">Qualsiasi durata</option><option value="breve">Fino a 6 giorni</option><option value="media">Da 7 a 9 giorni</option><option value="lunga">10 giorni o più</option>
            </select>
          </label>

          <label className={styles.field}>
            <span>Punto di incontro</span>
            <select value={filters.departure} onChange={(event) => updateFilter("departure", event.target.value)}>
              <option value="Tutti">Qualsiasi punto</option>{meetingPoints.map((point) => <option key={point}>{point}</option>)}
            </select>
          </label>

          <label className={styles.field}>
            <span>Trattamento</span>
            <select value={filters.board} onChange={(event) => updateFilter("board", event.target.value)}>
              <option value="Tutti">Qualsiasi formula</option><option value="All Inclusive">All Inclusive</option><option value="Pranzo">Pranzo incluso</option><option value="Cena">Cena inclusa</option><option value="Servizio privato">Servizio privato</option>
            </select>
          </label>

          <button className={styles.resetButton} type="button" onClick={() => setFilters(initialFilters)} disabled={activeFilters === 0}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 7v5h5M6.4 16a7 7 0 1 0-.8-7" /></svg>
            Cancella tutti i filtri
          </button>
        </aside>

        <div className={styles.resultsColumn}>
          <div className={styles.resultsBar} aria-live="polite">
            <p><strong>{filteredPackages.length}</strong> proposte trovate</p>
            <label>
              <span>Ordina per</span>
              <select value={sort} onChange={(event) => setSort(event.target.value)}>
                <option value="consigliati">Consigliati</option><option value="prezzo-crescente">Prezzo crescente</option><option value="prezzo-decrescente">Prezzo decrescente</option><option value="durata">Durata</option><option value="valutazione">Valutazione</option>
              </select>
            </label>
          </div>

          {filteredPackages.length > 0 ? (
            <div className={styles.grid}>
          {filteredPackages.map((travelPackage) => (
            <article className={styles.card} key={travelPackage.slug}>
              <Link className={styles.imageWrap} href={`/pacchetti/${travelPackage.slug}`} aria-label={`Scopri ${travelPackage.title}`}>
                <Image src={travelPackage.image} alt={travelPackage.title} fill sizes="(max-width: 700px) 92vw, (max-width: 1050px) 46vw, 31vw" />
                <span className={styles.badge}>{travelPackage.badge}</span>
                <span className={styles.rating}>
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3Z" /></svg>
                  {travelPackage.rating.toFixed(1)}
                </span>
              </Link>

              <div className={styles.cardContent}>
                <div className={styles.cardHeading}>
                  <div>
                    <span>{travelPackage.type} · {travelPackage.country}</span>
                    <h3><Link href={`/pacchetti/${travelPackage.slug}`}>{travelPackage.title}</Link></h3>
                  </div>
                  <span className={styles.reviewCount}>{travelPackage.reviews} recensioni</span>
                </div>

                <p className={styles.description}>{travelPackage.description}</p>

                <div className={styles.facts}>
                  <span><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8" /><path d="M12 7v5l3 2" /></svg>{travelPackage.days === 1 ? "Esperienza giornaliera" : `${travelPackage.days} giorni / ${travelPackage.nights} notti`}</span>
                  <span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 13h16M7 17h10M9 7h6l2 6H7l2-6Z" /></svg>Da {travelPackage.departures.join(", ")}</span>
                  <span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5h14v14H5zM8 3v4M16 3v4M5 9h14" /></svg>{travelPackage.period}</span>
                  <span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 8h16v10H4zM7 8V6h10v2M8 13h8" /></svg>{travelPackage.board}</span>
                </div>

                <div className={styles.cardFooter}>
                  <div className={styles.price}>
                    <span>A partire da</span>
                    <strong>€ {travelPackage.price.toLocaleString("it-IT")}</strong>
                    <small>{travelPackage.type === "Transfer" ? "a servizio" : "per persona"}</small>
                  </div>
                  <Link className={styles.detailsButton} href={`/pacchetti/${travelPackage.slug}`}>
                    Scopri
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M14 7l5 5-5 5" /></svg>
                  </Link>
                </div>
              </div>
            </article>
          ))}
            </div>
          ) : (
            <div className={styles.empty}>
              <span>✦</span>
              <h3>Nessun servizio corrisponde ai filtri</h3>
              <p>Modifica la ricerca oppure ripristina tutti i filtri.</p>
              <button type="button" onClick={() => setFilters(initialFilters)}>Mostra tutte le proposte</button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
