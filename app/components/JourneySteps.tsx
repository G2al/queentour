import Image from "next/image";
import Link from "next/link";
import styles from "./JourneySteps.module.css";

export default function JourneySteps() {
  return (
    <section className={styles.section} id="come-funziona" aria-labelledby="journey-steps-title">
      <div className={styles.heading}>
        <span className={styles.eyebrow}>Viaggiare con Queen Tour</span>
        <h2 id="journey-steps-title">Il tuo viaggio, reso semplice!</h2>
        <p>
          Dalla scelta della destinazione alla partenza: creiamo esperienze su misura,
          pensate per farti viaggiare senza pensieri.
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
            <h3>Trova la tua<br />destinazione</h3>
          </div>
        </article>

        <article className={`${styles.stepCard} ${styles.featuredCard}`}>
          <div className={styles.photo}>
            <Image
              src="/images/thailandia.jpg"
              alt="Mare cristallino e barche tradizionali in Thailandia"
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
            <h3>Prenota il<br />tuo viaggio</h3>
            <p>
              Raccontaci come immagini la tua vacanza. Il team Queen Tour costruirà
              la proposta perfetta per te.
            </p>
            <Link className={styles.learnMore} href="/pacchetti">
              Scopri i pacchetti
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
            <h3>Paga e<br />parti sereno</h3>
          </div>
        </article>
      </div>
    </section>
  );
}
