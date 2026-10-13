import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import FloatingWhatsApp from "@/app/components/FloatingWhatsApp";
import Footer from "@/app/components/Footer";
import Header from "@/app/components/Header";
import AboutMotion from "./AboutMotion";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Chi siamo | Queen Tour",
  description:
    "Conosci Queen Tour, specialista dell’Egitto e di Hurghada per hotel, trasferimenti ed escursioni Solo Land.",
};

const whatsappUrl =
  "https://wa.me/393296430362?text=Ciao%20Queen%20Tour%2C%20vorrei%20organizzare%20il%20mio%20soggiorno%20in%20Egitto.";

const method = [
  {
    number: "01",
    title: "Capiamo come vuoi vivere Hurghada",
    text: "Famiglia, coppia, relax o scoperta: partiamo dal tuo modo di viaggiare e dal budget reale.",
  },
  {
    number: "02",
    title: "Selezioniamo ciò che serve",
    text: "Hotel, transfer ed escursioni diventano una proposta Solo Land semplice, coerente e personale.",
  },
  {
    number: "03",
    title: "Rendiamo tutto trasparente",
    text: "Ti diciamo cosa è incluso, cosa resta fuori e come si svolgerà ogni servizio una volta arrivato.",
  },
  {
    number: "04",
    title: "Restiamo raggiungibili",
    text: "Prima dell’arrivo e durante il soggiorno hai un riferimento umano, diretto e riconoscibile.",
  },
];

const values = [
  {
    title: "Cura reale",
    text: "Ogni richiesta merita attenzione, tempo e una risposta costruita con criterio.",
  },
  {
    title: "Scelte chiare",
    text: "Ti aiutiamo a capire alternative e priorità, senza nascondere la complessità dietro parole difficili.",
  },
  {
    title: "Presenza umana",
    text: "Dietro ogni proposta trovi persone raggiungibili, capaci di ascoltare e prendersi responsabilità.",
  },
];

export default function AboutPage() {
  return (
    <>
      <Header />
      <AboutMotion>
        <section className={styles.hero} aria-labelledby="about-title">
          <div className={styles.heroCopy}>
            <span className={styles.eyebrow}>Da Aversa a Hurghada</span>
            <h1 id="about-title">
              Non vendiamo tutto il mondo.
              <span>Conosciamo davvero l’Egitto.</span>
            </h1>
            <p>
              Siamo specialisti Solo Land: selezioniamo hotel, coordiniamo trasferimenti
              e scegliamo esperienze autentiche a Hurghada e sul Mar Rosso.
            </p>
            <div className={styles.heroActions}>
              <Link href="/pacchetti">
                Scopri l’Egitto
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M14 7l5 5-5 5" /></svg>
              </Link>
              <a href={whatsappUrl} target="_blank" rel="noreferrer">Parliamo di Hurghada</a>
            </div>
            <div className={styles.locationLine}>
              <span className={styles.locationIcon} aria-hidden="true">
                <svg viewBox="0 0 24 24"><path d="M12 21s6-5.1 6-11a6 6 0 1 0-12 0c0 5.9 6 11 6 11Z" /><circle cx="12" cy="10" r="2" /></svg>
              </span>
              <span><strong>La nostra casa</strong>Via Roma, Aversa · Caserta</span>
            </div>
          </div>

          <div className={styles.heroVisual} aria-label="Hurghada e il Mar Rosso">
            <div className={styles.heroMainImage}>
              <Image src="/images/egypt-hurghada-hero.png" alt="La costa di Hurghada" fill priority sizes="(max-width: 760px) 86vw, 45vw" />
            </div>
            <div className={styles.heroCityImage}>
              <Image src="/images/egypt-hotel.png" alt="Resort sul Mar Rosso" fill sizes="(max-width: 760px) 36vw, 17vw" />
            </div>
            <div className={styles.heroDesertImage}>
              <Image src="/images/egypt-excursion.png" alt="Escursione sul Mar Rosso" fill sizes="(max-width: 760px) 31vw, 14vw" />
            </div>
            <div className={styles.heroSeal}>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 16.5 19.5 7l-4.2 10.7-3.1-4.1-4.5 2.7L4 16.5Z" /><path d="m12.2 13.6 7.3-6.6" /></svg>
              <span>Una meta</span>
              <strong>conosciuta bene</strong>
            </div>
          </div>

          <a className={styles.scrollCue} href="#manifesto" aria-label="Scorri per conoscere Queen Tour">
            <span>Conosciamoci</span>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m7 10 5 5 5-5" /></svg>
          </a>
        </section>

        <section className={styles.manifesto} id="manifesto" data-reveal>
          <div className={styles.sectionIndex}>
            <span>01</span>
            <p>Chi siamo</p>
          </div>
          <div className={styles.manifestoStatement}>
            <h2>
              La differenza tra conoscere l’Egitto e <em>venderlo</em>?
              I dettagli che solo uno specialista sa vedere.
            </h2>
          </div>
          <div className={styles.manifestoCopy}>
            <p>
              Queen Tour nasce ad Aversa e sceglie di concentrarsi sull’Egitto, in particolare Hurghada:
              una destinazione che vogliamo conoscere nelle sue zone, strutture e possibilità reali.
            </p>
            <p>
              Non includiamo il volo e non nascondiamo questa scelta. Ci occupiamo bene di ciò che avviene
              a terra: soggiorno, trasferimenti, escursioni e assistenza.
            </p>
            <a href="https://www.google.com/maps/search/?api=1&query=Via+Roma+Aversa+CE" target="_blank" rel="noreferrer">
              Vieni a trovarci ad Aversa
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M14 7l5 5-5 5" /></svg>
            </a>
          </div>
        </section>

        <section className={styles.methodSection} id="metodo">
          <div className={styles.sectionHeading} data-reveal>
            <div>
              <span className={styles.eyebrow}>Il metodo Queen Tour</span>
              <h2>Una destinazione sola.<br />Molta più competenza.</h2>
            </div>
            <p>Un metodo chiaro per costruire solo i servizi che ti servono davvero, senza pacchetti rigidi e senza voli imposti.</p>
          </div>
          <div className={styles.methodGrid}>
            {method.map((item) => (
              <article className={styles.methodCard} key={item.number} data-reveal>
                <span className={styles.methodNumber}>{item.number}</span>
                <span className={styles.methodIcon} aria-hidden="true">
                  <svg viewBox="0 0 24 24"><path d="M5 12h14M14 7l5 5-5 5" /></svg>
                </span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.experience} data-reveal>
          <div className={styles.experienceVisual}>
            <div className={styles.experienceMain}>
              <Image src="/images/egypt-excursion.png" alt="Mare cristallino delle isole Giftun" fill sizes="(max-width: 760px) 92vw, 49vw" />
            </div>
            <div className={styles.experienceSmall}>
              <Image src="/images/egypt-transfer.png" alt="Transfer privato a Hurghada" fill sizes="(max-width: 760px) 43vw, 20vw" />
            </div>
            <blockquote>“Il tuo Egitto comincia quando atterri.”</blockquote>
          </div>
          <div className={styles.experienceCopy}>
            <span className={styles.eyebrow}>La formula Solo Land</span>
            <h2>Il volo è tuo. Tutto il resto può essere nostro.</h2>
            <p>
              Prenoti il volo che preferisci e noi costruiamo ciò che ti aspetta in Egitto.
              Più libertà per te, più attenzione sui servizi che conosciamo davvero.
            </p>
            <ul>
              <li><span>01</span><div><strong>Il tuo hotel</strong><p>Selezionato per zona, stile, servizi e budget.</p></div></li>
              <li><span>02</span><div><strong>I tuoi spostamenti</strong><p>Transfer coordinati con gli orari del tuo arrivo.</p></div></li>
              <li><span>03</span><div><strong>Le tue esperienze</strong><p>Mare, deserto e cultura senza proposte standard.</p></div></li>
            </ul>
          </div>
        </section>

        <section className={styles.values} id="valori" data-reveal>
          <div className={styles.valuesIntro}>
            <span className={styles.lightEyebrow}>Ciò in cui crediamo</span>
            <h2>La specializzazione conta.<br />La fiducia ancora di più.</h2>
            <p>Dietro ogni preventivo trovi persone che conoscono la destinazione e restano raggiungibili.</p>
          </div>
          <div className={styles.valuesGrid}>
            {values.map((value, index) => (
              <article key={value.title}>
                <span>0{index + 1}</span>
                <h3>{value.title}</h3>
                <p>{value.text}</p>
              </article>
            ))}
          </div>
          <div className={styles.valuesOrbit} aria-hidden="true"><span /><span /><span /></div>
        </section>

        <section className={styles.destinations} data-reveal>
          <div className={styles.destinationHeading}>
            <span className={styles.eyebrow}>Tante anime, un solo Mar Rosso</span>
            <h2>Qual è la tua Hurghada?</h2>
          </div>
          <div className={styles.destinationRail}>
            <figure><Image src="/images/egypt-hotel.png" alt="Hurghada" fill sizes="30vw" /><figcaption>Hurghada <span>Vibrante</span></figcaption></figure>
            <figure><Image src="/images/egypt-hurghada-hero.png" alt="Sahl Hasheesh" fill sizes="30vw" /><figcaption>Sahl Hasheesh <span>Raffinata</span></figcaption></figure>
            <figure><Image src="/images/sharm.jpg" alt="Makadi Bay" fill sizes="30vw" /><figcaption>Makadi Bay <span>Family</span></figcaption></figure>
            <figure><Image src="/images/egypt-excursion.png" alt="Giftun Island" fill sizes="30vw" /><figcaption>Giftun Island <span>Autentica</span></figcaption></figure>
          </div>
        </section>

        <section className={styles.finalCta} data-reveal>
          <Image src="/images/egypt-hurghada-hero.png" alt="" fill sizes="96vw" aria-hidden="true" />
          <div className={styles.finalCtaContent}>
            <span className={styles.eyebrow}>Il tuo Egitto può iniziare qui</span>
            <h2>Raccontaci come vuoi viverlo.<br />A terra pensiamo a tutto noi.</h2>
            <div>
              <a href={whatsappUrl} target="_blank" rel="noreferrer">
                Inizia su WhatsApp
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M14 7l5 5-5 5" /></svg>
              </a>
              <Link href="/pacchetti">Esplora Hurghada</Link>
            </div>
          </div>
          <div className={styles.finalCtaMark}>QT</div>
        </section>
      </AboutMotion>
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}
