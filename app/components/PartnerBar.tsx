"use client";

import Image from "next/image";
import { PointerEvent, useRef, useState } from "react";
import styles from "./PartnerBar.module.css";

const regions = [
  { name: "Hurghada", detail: "Il cuore del Mar Rosso", image: "/images/egypt-hurghada-hero.png" },
  { name: "Sahl Hasheesh", detail: "Eleganza e baie tranquille", image: "/images/egypt-hotel.png" },
  { name: "Makadi Bay", detail: "La scelta ideale per le famiglie", image: "/images/sharm.jpg" },
  { name: "Soma Bay", detail: "Relax, sport e mare aperto", image: "/images/egypt-hotel.png" },
  { name: "El Gouna", detail: "Lagune e atmosfera esclusiva", image: "/images/egypt-hurghada-hero.png" },
  { name: "Giftun Island", detail: "Acqua turchese e barriera", image: "/images/egypt-excursion.png" },
];

function Socials() {
  return (
    <div className={styles.socials} aria-label="Social Queen Tour">
      <a href="#" aria-label="Queen Tour su Facebook"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 8.5V6.8c0-.8.5-1 1-1h2.8V2.1L14.6 2C11.3 2 10 4 10 6.5v2H7v4h3V22h4v-9.5h3.3l.5-4H14Z" /></svg></a>
      <a href="#" aria-label="Queen Tour su Instagram"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" /></svg></a>
      <a href="#" aria-label="Queen Tour su TikTok"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15.8 3c.4 2.3 1.7 3.7 4.2 3.9v3.2a8.5 8.5 0 0 1-4.2-1.3v6.4a6.2 6.2 0 1 1-5.3-6.1v3.2a3 3 0 1 0 2.1 2.9V3h3.2Z" /></svg></a>
    </div>
  );
}

export default function PartnerBar() {
  const [activeRegion, setActiveRegion] = useState<(typeof regions)[number] | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  const movePreview = (event: PointerEvent<HTMLSpanElement>) => {
    if (!previewRef.current || event.pointerType === "touch") return;
    const width = 272;
    const x = event.clientX + width + 28 > window.innerWidth ? event.clientX - width - 18 : event.clientX + 18;
    const y = Math.max(95, Math.min(window.innerHeight - 95, event.clientY));
    previewRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) translateY(-50%)`;
  };

  return (
    <section className={styles.bar} aria-label="Le località Queen Tour in Egitto">
      <div className={styles.followBox}>
        <div><span>Queen Tour</span><strong>Egitto, come lo vuoi tu.</strong></div>
        <Socials />
      </div>
      <div className={styles.regions}>
        <div className={styles.track}>
          {[0, 1, 2].map((copyIndex) => (
            <div className={styles.group} aria-hidden={copyIndex > 0 || undefined} key={copyIndex}>
              {regions.map((region) => (
                <span
                  className={styles.region}
                  key={`${copyIndex}-${region.name}`}
                  onPointerEnter={(event) => {
                    if (event.pointerType !== "touch") setActiveRegion(region);
                    movePreview(event);
                  }}
                  onPointerMove={movePreview}
                  onPointerLeave={() => setActiveRegion(null)}
                >
                  <i>✦</i>{region.name}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div
        className={`${styles.preview} ${activeRegion ? styles.previewVisible : ""}`}
        ref={previewRef}
        aria-hidden="true"
      >
        {activeRegion && (
          <>
            <Image src={activeRegion.image} alt="" fill sizes="272px" />
            <div><strong>{activeRegion.name}</strong><span>{activeRegion.detail}</span></div>
          </>
        )}
      </div>
    </section>
  );
}
