"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import styles from "./PackagesCarousel.module.css";

const packages = [
  {
    title: "Thailandia da sogno",
    location: "Phuket, Thailandia",
    image: "/images/thailandia.jpg",
    rating: "4.9",
    duration: "9 giorni / 7 notti",
    stay: "Resort 4★ con colazione",
    description:
      "Un viaggio tra spiagge tropicali, templi affascinanti e i paesaggi unici delle isole thailandesi.",
    included: ["Volo A/R", "7 notti", "Trasferimenti", "Assistenza Queen Tour"],
  },
  {
    title: "New York Experience",
    location: "New York, Stati Uniti",
    image: "/images/newyork.jpg",
    rating: "4.8",
    duration: "6 giorni / 5 notti",
    stay: "Hotel centrale 4★",
    description:
      "Vivi l’energia di Manhattan tra Times Square, Central Park, skyline iconici e quartieri indimenticabili.",
    included: ["Volo A/R", "5 notti", "Bagaglio incluso", "Assistenza Queen Tour"],
  },
  {
    title: "Sharm El Sheikh",
    location: "Mar Rosso, Egitto",
    image: "/images/sharm.jpg",
    rating: "4.9",
    duration: "8 giorni / 7 notti",
    stay: "Resort 5★ All Inclusive",
    description:
      "Relax sul Mar Rosso, fondali spettacolari e servizi All Inclusive in uno dei resort più apprezzati.",
    included: ["Volo A/R", "All Inclusive", "Trasferimenti", "Assistenza Queen Tour"],
  },
  {
    title: "Colori del Messico",
    location: "Guanajuato, Messico",
    image: "/images/messico.jpg",
    rating: "4.7",
    duration: "10 giorni / 8 notti",
    stay: "Tour e resort 4★",
    description:
      "Colori, cultura e tradizioni messicane in un itinerario che unisce città coloniali e mare caraibico.",
    included: ["Volo A/R", "8 notti", "Tour selezionati", "Assistenza Queen Tour"],
  },
  {
    title: "Dubai esclusiva",
    location: "Dubai, Emirati Arabi",
    image: "/images/dubai.jpg",
    rating: "4.8",
    duration: "6 giorni / 5 notti",
    stay: "Hotel 5★ con colazione",
    description:
      "Architettura futuristica, deserto e spiagge dorate per una vacanza elegante nel cuore degli Emirati.",
    included: ["Volo A/R", "5 notti", "Trasferimenti", "Assistenza Queen Tour"],
  },
  {
    title: "Maldive paradisiache",
    location: "Atollo di Malé, Maldive",
    image: "/images/maldive.jpg",
    rating: "5.0",
    duration: "9 giorni / 7 notti",
    stay: "Water villa All Inclusive",
    description:
      "Acque cristalline, ville sull’oceano e tramonti spettacolari per un’esperienza davvero indimenticabile.",
    included: ["Volo A/R", "All Inclusive", "Transfer in barca", "Assistenza Queen Tour"],
  },
];

export default function PackagesCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [activePackage, setActivePackage] = useState<(typeof packages)[number] | null>(null);

  useEffect(() => {
    if (!activePackage) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActivePackage(null);
    };

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
    const styles = window.getComputedStyle(track);
    const gap = Number.parseFloat(styles.columnGap || styles.gap) || 0;
    const step = (firstCard?.getBoundingClientRect().width ?? track.clientWidth) + gap;
    const maxScroll = track.scrollWidth - track.clientWidth;
    const nextPosition = track.scrollLeft + direction * step;

    if (direction === 1 && nextPosition > maxScroll + 2) {
      track.scrollTo({ left: 0, behavior: "smooth" });
      return;
    }

    if (direction === -1 && nextPosition < -2) {
      track.scrollTo({ left: maxScroll, behavior: "smooth" });
      return;
    }

    track.scrollBy({ left: direction * step, behavior: "smooth" });
  };

  return (
    <section className={styles.section} id="pacchetti" aria-labelledby="packages-title">
      <div className={styles.headingRow}>
        <div>
          <h2 className={styles.title} id="packages-title">
            Destinazioni popolari
          </h2>
          <p className={styles.subtitle}>Scopri il mondo con i pacchetti Queen Tour.</p>
        </div>

        <div className={styles.controls} aria-label="Controlli del carosello">
          <button
            className={`${styles.control} ${styles.previous}`}
            type="button"
            onClick={() => moveCarousel(-1)}
            aria-label="Destinazioni precedenti"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="m14 7-5 5 5 5" />
            </svg>
          </button>
          <button
            className={`${styles.control} ${styles.next}`}
            type="button"
            onClick={() => moveCarousel(1)}
            aria-label="Destinazioni successive"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="m10 7 5 5-5 5" />
            </svg>
          </button>
        </div>
      </div>

      <div className={styles.track} ref={trackRef}>
        {packages.map((travelPackage) => (
          <button
            className={styles.card}
            key={travelPackage.title}
            type="button"
            onClick={() => setActivePackage(travelPackage)}
            aria-label={`Scopri il pacchetto ${travelPackage.title}`}
          >
            <div className={styles.imageWrap}>
              <Image
                src={travelPackage.image}
                alt={travelPackage.title}
                fill
                sizes="(max-width: 680px) 84vw, (max-width: 1024px) 45vw, 30vw"
              />
            </div>

            <div className={styles.cardBody}>
              <div className={styles.cardText}>
                <h3>{travelPackage.title}</h3>
                <p>
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 21s6-5.1 6-11a6 6 0 1 0-12 0c0 5.9 6 11 6 11Z" />
                    <circle cx="12" cy="10" r="2" />
                  </svg>
                  {travelPackage.location}
                </p>
              </div>

              <span className={styles.rating} aria-label={`Valutazione ${travelPackage.rating} su 5`}>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3Z" />
                </svg>
                {travelPackage.rating}
              </span>
            </div>
          </button>
        ))}
      </div>

      {activePackage && (
        <div
          className={styles.modalBackdrop}
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setActivePackage(null);
          }}
        >
          <div
            className={styles.modal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="package-modal-title"
          >
            <button
              className={styles.closeButton}
              type="button"
              onClick={() => setActivePackage(null)}
              ref={closeButtonRef}
              aria-label="Chiudi i dettagli del pacchetto"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="m6 6 12 12M18 6 6 18" />
              </svg>
            </button>

            <div className={styles.modalImage}>
              <Image
                src={activePackage.image}
                alt={activePackage.title}
                fill
                sizes="(max-width: 760px) 92vw, 46vw"
              />
              <span className={styles.modalRating}>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3Z" />
                </svg>
                {activePackage.rating}
              </span>
            </div>

            <div className={styles.modalContent}>
              <p className={styles.modalEyebrow}>Pacchetto Queen Tour</p>
              <h2 id="package-modal-title">{activePackage.title}</h2>
              <p className={styles.modalLocation}>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 21s6-5.1 6-11a6 6 0 1 0-12 0c0 5.9 6 11 6 11Z" />
                  <circle cx="12" cy="10" r="2" />
                </svg>
                {activePackage.location}
              </p>
              <p className={styles.modalDescription}>{activePackage.description}</p>

              <div className={styles.packageFacts}>
                <div>
                  <span>Durata</span>
                  <strong>{activePackage.duration}</strong>
                </div>
                <div>
                  <span>Sistemazione</span>
                  <strong>{activePackage.stay}</strong>
                </div>
              </div>

              <div className={styles.included}>
                <span>Il pacchetto include</span>
                <ul>
                  {activePackage.included.map((item) => (
                    <li key={item}>
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="m5 12 4 4L19 6" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <a
                className={styles.quoteButton}
                href={`https://wa.me/393296430362?text=${encodeURIComponent(
                  `Ciao Queen Tour, vorrei ricevere un preventivo per il pacchetto ${activePackage.title}.`,
                )}`}
                target="_blank"
                rel="noreferrer"
              >
                Richiedi un preventivo
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M5 12h14M14 7l5 5-5 5" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
