import Image from "next/image";
import Link from "next/link";
import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <Image
        className={styles.sky}
        src="/images/sfondo-slide.png"
        alt="Cielo azzurro sopra le nuvole"
        fill
        priority
        sizes="(max-width: 1280px) 96vw, 1240px"
      />
      <div className={styles.atmosphere} />

      <Image
        className={styles.airplane}
        src="/images/queentour-aereo.png"
        alt="Aereo Queen Tour in volo"
        width={1672}
        height={941}
        priority
      />

      <div className={styles.content}>
        <p className={styles.eyebrow}>Il tuo viaggio, la nostra passione</p>
        <h1 id="hero-title" className={styles.title}>
          Vivi la magia
          <br />
          del viaggio!
        </h1>
        <div className={styles.actions}>
          <Link className={styles.primaryAction} href="/pacchetti">
            Scopri i pacchetti
          </Link>
          <Link
            className={styles.roundAction}
            href="/pacchetti"
            aria-label="Vai ai pacchetti viaggio"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="m9 6 6 6-6 6" />
            </svg>
          </Link>
        </div>
      </div>

      <aside className={styles.moreCard} aria-label="Scopri Queen Tour">
        <Link className={styles.moreHeading} href="/chi-siamo">
          <span>Scopri di più</span>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5 12h14M14 7l5 5-5 5" />
          </svg>
        </Link>

        <div className={styles.cardDetails}>
          <div className={styles.thumbnails} aria-hidden="true">
            <span className={styles.thumbnail}>
              <Image src="/images/sfondo-slide.png" alt="" fill sizes="52px" />
            </span>
            <span className={styles.thumbnail}>
              <Image src="/images/queentour-aereo.png" alt="" fill sizes="52px" />
            </span>
            <span className={`${styles.thumbnail} ${styles.brandThumbnail}`}>
              <Image
                src="/images/logo-qeentour-primary.png"
                alt=""
                fill
                sizes="52px"
              />
            </span>
          </div>
          <div className={styles.cardCopy}>
            <strong>Esperienze uniche</strong>
            <span>Viaggi su misura, dall’Italia al mondo.</span>
          </div>
        </div>
      </aside>
    </section>
  );
}
