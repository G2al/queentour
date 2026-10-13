"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import styles from "./JourneySteps.module.css";

export default function JourneySteps() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.22, rootMargin: "0px 0px -8%" },
    );

    observer.observe(section);
    const firstFrame = requestAnimationFrame(() => {
      const bounds = section.getBoundingClientRect();
      if (bounds.top < window.innerHeight * 0.94 && bounds.bottom > 0) setVisible(true);
    });
    const fallback = window.setTimeout(() => setVisible(true), 1400);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(firstFrame);
      window.clearTimeout(fallback);
    };
  }, []);

  return (
    <section
      className={`${styles.section} ${styles.motionReady} ${visible ? styles.visible : ""}`}
      id="come-funziona"
      aria-labelledby="journey-steps-title"
      ref={sectionRef}
    >
      <div className={styles.heading}>
        <span className={styles.eyebrow}>Solo Land · tre servizi, una regia</span>
        <h2 id="journey-steps-title">L’Egitto, reso semplice.</h2>
        <p>
          Il volo lo scegli tu. Dal momento in cui atterri, possiamo occuparci di tutto
          ciò che rende speciale e sereno il tuo soggiorno.
        </p>
      </div>

      <div className={styles.steps}>
        <article className={`${styles.stepCard} ${styles.sideCard}`}>
          <span className={styles.sideIcon} aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path d="M12 21s6-5.1 6-11a6 6 0 1 0-12 0c0 5.9 6 11 6 11Z" />
              <circle cx="12" cy="10" r="2" />
            </svg>
          </span>
          <div className={styles.sideContent}>
            <span className={styles.number}>01</span>
            <h3>Transfer<br />senza attese</h3>
          </div>
        </article>

        <article className={`${styles.stepCard} ${styles.featuredCard}`}>
          <div className={styles.photo}>
            <Image
              src="/images/egypt-hotel.png"
              alt="Resort selezionato a Hurghada"
              fill
              sizes="(max-width: 700px) 44vw, 180px"
            />
          </div>

          <span className={styles.featuredIcon} aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path d="M7 5.5h10M7 18.5h10M8 5.5v3a3.8 3.8 0 0 0 1.9 3.3A3.8 3.8 0 0 0 8 15v3.5M16 5.5v3a3.8 3.8 0 0 1-1.9 3.3A3.8 3.8 0 0 1 16 15v3.5" />
              <path d="M9.9 11.8h4.2" />
            </svg>
          </span>

          <div className={styles.featuredContent}>
            <span className={styles.number}>02</span>
            <h3>Scegli il<br />tuo hotel</h3>
            <p>
              Dal resort family al soggiorno premium: troviamo la struttura giusta
              per il tuo modo di vivere Hurghada.
            </p>
            <Link className={styles.learnMore} href="/pacchetti">
              Scopri i soggiorni
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M5 12h14M14 7l5 5-5 5" />
              </svg>
            </Link>
          </div>
        </article>

        <article className={`${styles.stepCard} ${styles.sideCard}`}>
          <span className={styles.sideIcon} aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path d="M5 8h14v10H5zM8 8V6.5A2.5 2.5 0 0 1 10.5 4h3A2.5 2.5 0 0 1 16 6.5V8" />
              <path d="M5 12h14M10 12v2h4v-2" />
            </svg>
          </span>
          <div className={styles.sideContent}>
            <span className={styles.number}>03</span>
            <h3>Vivi le<br />escursioni</h3>
          </div>
        </article>
      </div>
    </section>
  );
}
