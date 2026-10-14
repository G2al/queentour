"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { PackageFilters, PaginatedPackages, TravelPackage } from "@/app/data/travelPackages";
import styles from "./PackageCatalog.module.css";

type FiltersState = { search: string; destination: string; type: string; maxPrice: string; days: string; departure: string; board: string };
const initialFilters: FiltersState = { search: "", destination: "", type: "", maxPrice: "", days: "", departure: "", board: "" };
const formatPrice = (value: number, currency = "EUR") => new Intl.NumberFormat("it-IT", { style: "currency", currency, maximumFractionDigits: 0 }).format(value);
const priceUnitLabel = (item: TravelPackage) => item.priceUnit === "per_service" ? "a servizio" : "a persona";

export default function PackageCatalog({ initialData, filterOptions }: { initialData: PaginatedPackages; filterOptions: PackageFilters }) {
  const [filters, setFilters] = useState(initialFilters);
  const [sort, setSort] = useState("recommended");
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [packages, setPackages] = useState(initialData.data);
  const [total, setTotal] = useState(initialData.meta.total);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const firstRender = useRef(true);
  const updateFilter = (key: keyof FiltersState, value: string) => setFilters((current) => ({ ...current, [key]: value }));

  useEffect(() => {
    if (firstRender.current) { firstRender.current = false; return; }
    const controller = new AbortController();
    const timeout = window.setTimeout(async () => {
      setLoading(true); setError("");
      const query = new URLSearchParams({ per_page: "100", sort });
      Object.entries(filters).forEach(([key, value]) => { if (value) query.set(key === "maxPrice" ? "max_price" : key, value); });
      try {
        const response = await fetch(`/api/packages?${query.toString()}`, { signal: controller.signal, cache: "no-store" });
        const payload = await response.json();
        if (!response.ok) throw new Error(payload.message || "Impossibile aggiornare il catalogo.");
        setPackages(payload.data ?? []); setTotal(payload.meta?.total ?? payload.data?.length ?? 0);
      } catch (requestError) {
        if (requestError instanceof DOMException && requestError.name === "AbortError") return;
        setError(requestError instanceof Error ? requestError.message : "Impossibile aggiornare il catalogo.");
      } finally { if (!controller.signal.aborted) setLoading(false); }
    }, filters.search ? 350 : 0);
    return () => { window.clearTimeout(timeout); controller.abort(); };
  }, [filters, sort]);

  const activeFilters = Object.values(filters).filter(Boolean).length;
  const maxBudget = Math.max(1, filterOptions.priceRange?.max ?? 1);
  const budgetOptions = [0.25, 0.5, 0.75, 1].map((part) => Math.ceil((maxBudget * part) / 10) * 10).filter((value, index, values) => value > 0 && values.indexOf(value) === index);

  return (
    <section className={styles.catalog} id="catalogo" aria-labelledby="catalog-title">
      <div className={styles.headingRow}><div><span className={styles.eyebrow}>Queen Tour · Egitto</span><h2 id="catalog-title">Costruisci la tua Hurghada</h2></div><p>Combina soggiorno, trasferimento ed escursioni. Il volo resta sempre escluso.</p></div>
      <button className={`${styles.mobileFilterToggle} ${advancedOpen ? styles.mobileFilterToggleOpen : ""}`} type="button" onClick={() => setAdvancedOpen((open) => !open)} aria-expanded={advancedOpen} aria-controls="package-filter-panel"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M7 12h10M10 17h4" /></svg>Filtra i servizi{activeFilters > 0 && <span>{activeFilters}</span>}</button>
      <div className={styles.catalogLayout}>
        <aside className={`${styles.filterPanel} ${advancedOpen ? styles.filterPanelOpen : ""}`} id="package-filter-panel">
          <div className={styles.filterHeading}><div><span>La tua vacanza in Egitto</span><h3>Filtra i servizi</h3></div>{activeFilters > 0 && <span className={styles.activeCount}>{activeFilters}</span>}</div>
          <label className={styles.field}><span>Cerca</span><div className={styles.inputWrap}><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 4 4" /></svg><input value={filters.search} onChange={(event) => updateFilter("search", event.target.value)} placeholder="Hurghada, hotel, escursione..." type="search" /></div></label>
          <label className={styles.field}><span>Destinazione</span><select value={filters.destination} onChange={(event) => updateFilter("destination", event.target.value)}><option value="">Tutte</option>{filterOptions.destinations.map((item) => <option value={item.slug} key={item.slug}>{item.name}</option>)}</select></label>
          <label className={styles.field}><span>Tipologia</span><select value={filters.type} onChange={(event) => updateFilter("type", event.target.value)}><option value="">Tutte</option>{filterOptions.types.map((type) => <option key={type}>{type}</option>)}</select></label>
          <label className={styles.field}><span>Budget massimo</span><select value={filters.maxPrice} onChange={(event) => updateFilter("maxPrice", event.target.value)}><option value="">Qualsiasi</option>{budgetOptions.map((price) => <option value={price} key={price}>Fino a {formatPrice(price)}</option>)}</select></label>
          <label className={styles.field}><span>Durata</span><select value={filters.days} onChange={(event) => updateFilter("days", event.target.value)}><option value="">Qualsiasi durata</option>{filterOptions.days.map((days) => <option value={days} key={days}>{days === 1 ? "1 giorno" : `${days} giorni`}</option>)}</select></label>
          <label className={styles.field}><span>Punto di incontro</span><select value={filters.departure} onChange={(event) => updateFilter("departure", event.target.value)}><option value="">Qualsiasi punto</option>{filterOptions.departures.map((point) => <option key={point}>{point}</option>)}</select></label>
          <label className={styles.field}><span>Trattamento</span><select value={filters.board} onChange={(event) => updateFilter("board", event.target.value)}><option value="">Qualsiasi formula</option>{filterOptions.boards.map((board) => <option key={board}>{board}</option>)}</select></label>
          <button className={styles.resetButton} type="button" onClick={() => setFilters(initialFilters)} disabled={activeFilters === 0}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 7v5h5M6.4 16a7 7 0 1 0-.8-7" /></svg>Cancella tutti i filtri</button>
        </aside>
        <div className={`${styles.resultsColumn} ${loading ? styles.resultsLoading : ""}`} aria-busy={loading}>
          <div className={styles.resultsBar} aria-live="polite"><p><strong>{total}</strong> proposte trovate</p><label><span>Ordina per</span><select value={sort} onChange={(event) => setSort(event.target.value)}><option value="recommended">Consigliati</option><option value="price_asc">Prezzo crescente</option><option value="price_desc">Prezzo decrescente</option><option value="duration">Durata</option><option value="newest">Più recenti</option></select></label></div>
          {error && <div className={styles.error} role="alert">{error}<button type="button" onClick={() => setFilters((current) => ({ ...current }))}>Riprova</button></div>}
          {packages.length > 0 ? <div className={styles.grid}>{packages.map((item) => (
            <article className={styles.card} key={item.slug}>
              <Link className={styles.imageWrap} href={`/pacchetti/${item.slug}`} aria-label={`Scopri ${item.title}`}><Image src={item.image} alt={item.title} fill sizes="(max-width: 700px) 92vw, (max-width: 1050px) 46vw, 31vw" />{item.badge && <span className={styles.badge}>{item.badge}</span>}</Link>
              <div className={styles.cardContent}>
                <div className={styles.cardHeading}><div><span>{item.type} · {item.country}</span><h3><Link href={`/pacchetti/${item.slug}`}>{item.title}</Link></h3></div></div>
                <p className={styles.description}>{item.description}</p>
                <div className={styles.facts}>
                  <span><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8" /><path d="M12 7v5l3 2" /></svg>{item.days === 1 ? "Esperienza giornaliera" : `${item.days} giorni / ${item.nights} notti`}</span>
                  {item.departures.length > 0 && <span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 13h16M7 17h10M9 7h6l2 6H7l2-6Z" /></svg>Da {item.departures.join(", ")}</span>}
                  {item.period && <span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5h14v14H5zM8 3v4M16 3v4M5 9h14" /></svg>{item.period}</span>}
                  {item.board && <span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 8h16v10H4zM7 8V6h10v2M8 13h8" /></svg>{item.board}</span>}
                </div>
                <div className={styles.cardFooter}><div className={styles.price}><span>{item.price === null ? "Disponibilità" : item.priceType === "net" ? "Prezzo netto agenzia" : "A partire da"}</span><strong>{item.price === null ? "Prezzo su richiesta" : formatPrice(item.price, item.currency)}</strong>{item.price !== null && <small>{priceUnitLabel(item)}</small>}{item.priceType === "net" && item.priceGross != null && <small className={styles.grossPrice}>Pubblico: {formatPrice(item.priceGross, item.currency)}</small>}</div><Link className={styles.detailsButton} href={`/pacchetti/${item.slug}`}>Scopri<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M14 7l5 5-5 5" /></svg></Link></div>
              </div>
            </article>
          ))}</div> : !error && <div className={styles.empty}><span>✦</span><h3>Nessun servizio corrisponde ai filtri</h3><p>Modifica la ricerca oppure ripristina tutti i filtri.</p><button type="button" onClick={() => setFilters(initialFilters)}>Mostra tutte le proposte</button></div>}
        </div>
      </div>
    </section>
  );
}
