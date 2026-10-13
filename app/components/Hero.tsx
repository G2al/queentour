"use client";

import Image from "next/image";
import Link from "next/link";
import { PointerEvent, useEffect, useRef } from "react";
import styles from "./Hero.module.css";

const services = ["Hotel", "Transfer", "Escursioni"];

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const hero = heroRef.current;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!hero || reducedMotion) return;

    let frame = 0;
    const updateScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rect = hero.getBoundingClientRect();
        const progress = Math.max(0, Math.min(1, -rect.top / Math.max(rect.height, 1)));
        hero.style.setProperty("--hero-scroll-y", `${progress * 62}px`);
        hero.style.setProperty("--content-scroll-y", `${progress * -24}px`);
        hero.style.setProperty("--card-scroll-y", `${progress * -15}px`);
      });
    };

    updateScroll();
    window.addEventListener("scroll", updateScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", updateScroll);
    };
  }, []);

  const moveScene = (event: PointerEvent<HTMLElement>) => {
    const hero = heroRef.current;
    if (!hero || event.pointerType === "touch") return;
    const bounds = hero.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    hero.style.setProperty("--hero-x", `${x * -18}px`);
    hero.style.setProperty("--hero-pointer-y", `${y * -12}px`);
    hero.style.setProperty("--glow-x", `${(x + 0.5) * 100}%`);
    hero.style.setProperty("--glow-y", `${(y + 0.5) * 100}%`);
  };

  const resetScene = () => {
    const hero = heroRef.current;
    if (!hero) return;
    hero.style.setProperty("--hero-x", "0px");
    hero.style.setProperty("--hero-pointer-y", "0px");
  };

  return (
    <section
      className={styles.hero}
      aria-labelledby="hero-title"
      ref={heroRef}
      onPointerMove={moveScene}
      onPointerLeave={resetScene}
    >
      <div className={styles.coverLayer} aria-hidden="true">
        <Image
          className={styles.cover}
          src="/images/egypt-hurghada-hero.png"
          alt=""
          fill
          priority
          sizes="(max-width: 1280px) 110vw, 1750px"
        />
      </div>
      <div className={styles.atmosphere} />
      <div className={styles.pointerGlow} aria-hidden="true" />
      <div className={styles.sun} aria-hidden="true" />

      <svg className={styles.route} viewBox="0 0 520 190" aria-hidden="true">
        <path d="M18 158C104 50 236 206 354 76c52-57 101-53 150-38" />
        <circle cx="18" cy="158" r="5" />
        <circle cx="504" cy="38" r="6" />
      </svg>

      <div className={styles.content}>
        <p className={styles.eyebrow}>Specialisti dell’Egitto · Solo Land</p>
        <h1 id="hero-title" className={styles.title}>
          <span>Il tuo Egitto,</span>
          <br />
          <em>senza pensieri.</em>
        </h1>
        <p className={styles.lead}>
          Soggiorni selezionati, trasferimenti affidabili ed escursioni autentiche
          a Hurghada. Tu scegli come vivere il Mar Rosso, noi curiamo tutto a terra.
        </p>
        <div className={styles.actions}>
          <Link className={styles.primaryAction} href="/pacchetti">
            Scopri Hurghada
          </Link>
          <Link className={styles.roundAction} href="/contatti" aria-label="Richiedi una proposta">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M14 7l5 5-5 5" /></svg>
          </Link>
        </div>
      </div>

      <aside className={styles.moreCard} aria-label="Servizi Queen Tour in Egitto">
        <Link className={styles.moreHeading} href="/pacchetti">
          <span>Il meglio di Hurghada</span>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M14 7l5 5-5 5" /></svg>
        </Link>
        <div className={styles.serviceList}>
          {services.map((service, index) => (
            <div className={styles.service} key={service}>
              <span>0{index + 1}</span>
              <strong>{service}</strong>
            </div>
          ))}
        </div>
        <p className={styles.landNote}>Servizi a terra · volo escluso</p>
      </aside>

      <a className={styles.scrollCue} href="#pacchetti">
        <span>Esplora</span><i />
      </a>
    </section>
  );
}
