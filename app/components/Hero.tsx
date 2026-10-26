"use client";

import Image from "next/image";
import { PointerEvent, useEffect, useRef, useState } from "react";
import type { PackageFilters } from "@/app/data/travelPackages";
import CustomSelect from "./CustomSelect";
import styles from "./Hero.module.css";

export default function Hero({ filterOptions }: { filterOptions: PackageFilters | null }) {
  const heroRef = useRef<HTMLElement>(null);
  const [service, setService] = useState("");

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    const updateScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rect = hero.getBoundingClientRect();
        const progress = Math.max(0, Math.min(1, -rect.top / Math.max(rect.height, 1)));
        hero.style.setProperty("--hero-scroll-y", `${progress * 62}px`);
      });
    };
    updateScroll();
    window.addEventListener("scroll", updateScroll, { passive: true });
    return () => { cancelAnimationFrame(frame); window.removeEventListener("scroll", updateScroll); };
  }, []);

  const moveScene = (event: PointerEvent<HTMLElement>) => {
    const hero = heroRef.current;
    if (!hero || event.pointerType === "touch" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const bounds = hero.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - .5;
    const y = (event.clientY - bounds.top) / bounds.height - .5;
    hero.style.setProperty("--hero-x", `${x * -18}px`);
    hero.style.setProperty("--hero-pointer-y", `${y * -12}px`);
    hero.style.setProperty("--glow-x", `${(x + .5) * 100}%`);
    hero.style.setProperty("--glow-y", `${(y + .5) * 100}%`);
  };

  return (
    <section className={styles.hero} aria-labelledby="hero-title" ref={heroRef} onPointerMove={moveScene} onPointerLeave={() => {
      heroRef.current?.style.setProperty("--hero-x", "0px");
      heroRef.current?.style.setProperty("--hero-pointer-y", "0px");
    }}>
      <div className={styles.coverLayer} aria-hidden="true"><Image className={styles.cover} src="/images/egypt-hurghada-hero.png" alt="" fill priority sizes="(max-width: 1280px) 110vw, 1750px" /></div>
      <div className={styles.atmosphere} aria-hidden="true" />
      <div className={styles.pointerGlow} aria-hidden="true" />
      <div className={styles.sun} aria-hidden="true" />
      <svg className={styles.route} viewBox="0 0 520 190" aria-hidden="true"><path d="M18 158C104 50 236 206 354 76c52-57 101-53 150-38" /><circle cx="18" cy="158" r="5" /><circle cx="504" cy="38" r="6" /></svg>
      <svg className={styles.waves} viewBox="0 0 2880 160" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 70Q180 5 360 70T720 70T1080 70T1440 70T1800 70T2160 70T2520 70T2880 70V160H0Z" />
        <path d="M0 100Q180 40 360 100T720 100T1080 100T1440 100T1800 100T2160 100T2520 100T2880 100V160H0Z" />
        <path d="M0 125Q180 75 360 125T720 125T1080 125T1440 125T1800 125T2160 125T2520 125T2880 125V160H0Z" />
      </svg>

      <div className={styles.searchCard}>
        <div className={styles.heading}><span className={styles.eyebrow}>Queen Tour · Specialisti Egitto</span><h1 id="hero-title">Organizza il tuo Egitto.</h1><p>Scegli i servizi e trova la proposta per te.</p></div>
        <form action="/pacchetti#catalogo" method="get" className={styles.form}>
          <fieldset className={styles.services}><legend className={styles.srOnly}>Quale servizio cerchi?</legend>
            <label className={service === "" ? styles.selected : ""}><input type="radio" name="type" value="" checked={service === ""} onChange={() => setService("")} /><span>Tutte le proposte</span></label>
            {filterOptions?.types.map((type) => <label key={type} className={service === type ? styles.selected : ""}><input type="radio" name="type" value={type} checked={service === type} onChange={() => setService(type)} /><span>{type === "Soggiorno" ? "Hotel e soggiorni" : type === "Transfer" ? "Trasferimenti" : "Escursioni"}</span></label>)}
          </fieldset>
          <div className={styles.fields}>
            <CustomSelect variant="hero" label="Destinazione" name="destination" options={[{ value: "", label: "Dove vuoi andare?" }, ...(filterOptions?.destinations ?? []).map((item) => ({ value: item.slug, label: item.name }))]} />
            <label className={styles.field}><span>Data di partenza</span><input type="date" name="date" aria-label="Data di partenza" /></label>
            <CustomSelect variant="hero" label="Durata" name="days" options={[{ value: "", label: "Qualsiasi durata" }, ...(filterOptions?.days ?? []).map((days) => ({ value: String(days), label: days === 1 ? "1 giorno" : `${days} giorni` }))]} />
            <CustomSelect variant="hero" label="Trattamento" name="board" options={[{ value: "", label: "Tutte le formule" }, ...(filterOptions?.boards ?? []).map((board) => ({ value: board, label: board }))]} />
          </div>
          <div className={styles.formFooter}><span>Soggiorni con o senza volo · Transfer ed escursioni</span><button type="submit">Cerca le proposte<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 4 4" /></svg></button></div>
        </form>
      </div>
    </section>
  );
}
