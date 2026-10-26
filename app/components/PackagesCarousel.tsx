"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { TravelPackage } from "@/app/data/travelPackages";
import OfferFeatures from "./booking/OfferFeatures";
import { offerPriceCaption, offerDuration } from "@/lib/offers";
import { money } from "@/lib/format";
import styles from "./PackagesCarousel.module.css";

export default function PackagesCarousel({ packages, loadError = false }: { packages: TravelPackage[]; loadError?: boolean }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [activePackage, setActivePackage] = useState<TravelPackage | null>(null);

  useEffect(() => {
    if (!activePackage) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();
    const closeOnEscape = (event: KeyboardEvent) => event.key === "Escape" && setActivePackage(null);
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [activePackage]);

  const moveCarousel = (direction: -1 | 1) => {
    const track = trackRef.current;
    if (!track) return;
    const firstCard = track.firstElementChild as HTMLElement | null;
    const computed = window.getComputedStyle(track);
    const gap = Number.parseFloat(computed.columnGap || computed.gap) || 0;
    const step = (firstCard?.getBoundingClientRect().width ?? track.clientWidth) + gap;
    const maxScroll = track.scrollWidth - track.clientWidth;
    const nextPosition = track.scrollLeft + direction * step;
    if (direction === 1 && nextPosition > maxScroll + 2) return track.scrollTo({ left: 0, behavior: "smooth" });
    if (direction === -1 && nextPosition < -2) return track.scrollTo({ left: maxScroll, behavior: "smooth" });
    track.scrollBy({ left: direction * step, behavior: "smooth" });
  };

  return (
    <section className={styles.section} id="pacchetti" aria-labelledby="packages-title">
      <div className={styles.headingRow}>
        <div>
          <span className={styles.eyebrow}>Vivi Hurghada a modo tuo</span>
          <h2 className={styles.title} id="packages-title">Il meglio del Mar Rosso</h2>
          <p className={styles.subtitle}>Soggiorni, transfer ed esperienze selezionate. Con o senza volo.</p>
        </div>
        <div className={styles.controls} aria-label="Controlli del carosello">
          <button className={`${styles.control} ${styles.previous}`} type="button" onClick={() => moveCarousel(-1)} aria-label="Proposte precedenti"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m14 7-5 5 5 5" /></svg></button>
          <button className={`${styles.control} ${styles.next}`} type="button" onClick={() => moveCarousel(1)} aria-label="Proposte successive"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m10 7 5 5-5 5" /></svg></button>
        </div>
      </div>

      {loadError ? <div className={styles.catalogMessage}>Le proposte non sono disponibili in questo momento. <Link href="/pacchetti">Riprova dal catalogo</Link></div> : packages.length === 0 ? <div className={styles.catalogMessage}>Nuove proposte in arrivo.</div> : <div className={styles.track} ref={trackRef}>
        {packages.map((travelPackage) => (
          <button className={styles.card} key={travelPackage.slug} type="button" onClick={() => setActivePackage(travelPackage)} aria-label={`Scopri ${travelPackage.title}`}>
            <div className={styles.imageWrap}>
              <Image src={travelPackage.image} alt={travelPackage.title} fill sizes="(max-width: 680px) 84vw, (max-width: 1024px) 45vw, 30vw" />
              <span className={styles.cardBadge}>{travelPackage.type}</span>
            </div>
            <div className={styles.cardBody}>
              <div className={styles.cardText}>
                <h3>{travelPackage.title}</h3>
                <p><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s6-5.1 6-11a6 6 0 1 0-12 0c0 5.9 6 11 6 11Z" /><circle cx="12" cy="10" r="2" /></svg>{travelPackage.location}</p>
              </div>
              <span className={styles.rating}>{travelPackage.price == null ? "Prezzo su richiesta" : `${travelPackage.priceBasis === "per_service" ? "" : "da "}${money(travelPackage.price, travelPackage.currency)}`}</span>
            </div>
            <OfferFeatures product={travelPackage} />
            {travelPackage.price != null && <p className={styles.priceCaption}>{offerPriceCaption(travelPackage)}</p>}
          </button>
        ))}
      </div>}

      {activePackage && (
        <div className={styles.modalBackdrop} role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setActivePackage(null)}>
          <div className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="package-modal-title">
            <button className={styles.closeButton} type="button" onClick={() => setActivePackage(null)} ref={closeButtonRef} aria-label="Chiudi i dettagli"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg></button>
            <div className={styles.modalImage}>
              <Image src={activePackage.image} alt={activePackage.title} fill sizes="(max-width: 760px) 92vw, 46vw" />
              {activePackage.badge && <span className={styles.modalRating}>{activePackage.badge}</span>}
            </div>
            <div className={styles.modalContent}>
              <p className={styles.modalEyebrow}>{activePackage.type}</p>
              <h2 id="package-modal-title">{activePackage.title}</h2>
              <p className={styles.modalLocation}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s6-5.1 6-11a6 6 0 1 0-12 0c0 5.9 6 11 6 11Z" /><circle cx="12" cy="10" r="2" /></svg>{activePackage.location}</p>
              <p className={styles.modalDescription}>{activePackage.description}</p>
              <div className={styles.packageFacts}>
                <div><span>Durata</span><strong>{offerDuration(activePackage)}</strong></div>
                {activePackage.board && <div><span>Formula</span><strong>{activePackage.board}</strong></div>}
              </div>
              <div className={styles.included}><span>La proposta include</span><ul>{activePackage.included.slice(0, 4).map((item) => <li key={item}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 4 4L19 6" /></svg>{item}</li>)}</ul></div>
              <OfferFeatures product={activePackage} /><p className={styles.flightNote}>{offerPriceCaption(activePackage)}</p>
              <Link className={styles.quoteButton} href={`/pacchetti/${activePackage.slug}`}>Scopri tutti i dettagli<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M14 7l5 5-5 5" /></svg></Link>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
