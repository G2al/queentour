import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import FloatingWhatsApp from "@/app/components/FloatingWhatsApp";
import Footer from "@/app/components/Footer";
import Header from "@/app/components/Header";
import dubaiImage from "@/public/images/dubai.jpg";
import maldiveImage from "@/public/images/maldive.jpg";
import newYorkImage from "@/public/images/newyork.jpg";
import planeImage from "@/public/images/queentour-aereo.png";
import AboutMotion from "./AboutMotion";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Chi siamo | Queen Tour",
  description:
    "Conosci Queen Tour, tour operator ad Aversa. Viaggi su misura, ascolto autentico e assistenza dedicata dalla prima idea al rientro.",
};

const whatsappUrl =
  "https://wa.me/393296430362?text=Ciao%20Queen%20Tour%2C%20vorrei%20iniziare%20a%20progettare%20il%20mio%20prossimo%20viaggio.";

const method = [
  {
    number: "01",
    title: "Ascoltiamo prima di proporre",
    text: "Partiamo da desideri, ritmi, budget e aspettative. La destinazione giusta arriva dopo, non prima.",
  },
  {
    number: "02",
    title: "Disegniamo intorno a te",
    text: "Voli, soggiorni ed esperienze diventano un itinerario coerente, semplice da vivere e davvero personale.",
  },
  {
    number: "03",
    title: "Controlliamo ogni dettaglio",
    text: "Trasformiamo la complessità in chiarezza, così sai sempre cosa aspettarti prima della partenza.",
  },
  {
    number: "04",
    title: "Restiamo al tuo fianco",
    text: "Il rapporto non finisce con la prenotazione: ci siamo prima, durante e dopo il viaggio.",
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
            <span className={styles.eyebrow}>Queen Tour · Aversa</span>
            <h1 id="about-title">
              Non vendiamo viaggi.
              <span>Disegniamo ricordi.</span>
            </h1>
            <p>
              Siamo il tour operator che trasforma una partenza in qualcosa che ti somiglia davvero:
              pensato con cura, spiegato con chiarezza, vissuto senza distanza.
            </p>
            <div className={styles.heroActions}>
              <Link href="/pacchetti">
                Scopri le destinazioni
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M14 7l5 5-5 5" /></svg>
              </Link>
              <a href={whatsappUrl} target="_blank" rel="noreferrer">Parliamo del tuo viaggio</a>
            </div>
            <div className={styles.locationLine}>
              <span className={styles.locationIcon} aria-hidden="true">
                <svg viewBox="0 0 24 24"><path d="M12 21s6-5.1 6-11a6 6 0 1 0-12 0c0 5.9 6 11 6 11Z" /><circle cx="12" cy="10" r="2" /></svg>
              </span>
              <span><strong>La nostra casa</strong>Via Roma, Aversa · Caserta</span>
            </div>
          </div>

          <div className={styles.heroVisual} aria-label="Destinazioni Queen Tour">
            <div className={styles.heroMainImage}>
              <Image src={maldiveImage} alt="Laguna tropicale alle Maldive" fill priority placeholder="blur" sizes="(max-width: 760px) 86vw, 45vw" />
            </div>
            <div className={styles.heroCityImage}>
              <Image src={newYorkImage} alt="New York" fill placeholder="blur" sizes="(max-width: 760px) 36vw, 17vw" />
            </div>
            <div className={styles.heroDesertImage}>
              <Image src={dubaiImage} alt="Dubai" fill placeholder="blur" sizes="(max-width: 760px) 31vw, 14vw" />
            </div>
            <div className={styles.heroSeal}>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 16.5 19.5 7l-4.2 10.7-3.1-4.1-4.5 2.7L4 16.5Z" /><path d="m12.2 13.6 7.3-6.6" /></svg>
              <span>Da Aversa</span>
              <strong>al mondo</strong>
            </div>
            <Image className={styles.heroPlane} src={planeImage} alt="" placeholder="blur" aria-hidden="true" />
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
              La distanza tra <em>desiderare</em> e partire?
              Una persona che ascolta davvero.
            </h2>
          </div>
          <div className={styles.manifestoCopy}>
            <p>
              Queen Tour nasce ad Aversa con un’idea semplice: scegliere un viaggio non dovrebbe mai
              sembrare una pratica da sbrigare. È una decisione importante, personale, piena di aspettative.
            </p>
            <p>
              Per questo uniamo competenza e rapporto umano. I pacchetti sono un punto di partenza;
              il risultato finale deve parlare di te.
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
              <h2>Prima ti ascoltiamo.<br />Poi costruiamo il resto.</h2>
            </div>
            <p>Un processo semplice, leggibile e umano. Per arrivare alla partenza con una sola sensazione: è proprio il mio viaggio.</p>
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
              <Image src="/images/thailandia.jpg" alt="Mare cristallino in Thailandia" fill sizes="(max-width: 760px) 92vw, 49vw" />
            </div>
            <div className={styles.experienceSmall}>
              <Image src="/images/messico.jpg" alt="Esperienza di viaggio in Messico" fill sizes="(max-width: 760px) 43vw, 20vw" />
            </div>
            <blockquote>“Il tuo viaggio non deve assomigliare a un catalogo.”</blockquote>
          </div>
          <div className={styles.experienceCopy}>
            <span className={styles.eyebrow}>Oltre la destinazione</span>
            <h2>Il viaggio inizia molto prima del decollo.</h2>
            <p>
              Inizia quando qualcuno capisce cosa stai cercando, anche se non sai ancora come chiamarlo.
              È lì che una semplice vacanza diventa un’esperienza costruita bene.
            </p>
            <ul>
              <li><span>01</span><div><strong>Il tuo ritmo</strong><p>Relax, scoperta o entrambi: nessuna formula obbligatoria.</p></div></li>
              <li><span>02</span><div><strong>Le tue priorità</strong><p>Investiamo il budget dove per te conta davvero.</p></div></li>
              <li><span>03</span><div><strong>La tua tranquillità</strong><p>Informazioni chiare e un riferimento sempre riconoscibile.</p></div></li>
            </ul>
          </div>
        </section>

        <section className={styles.values} id="valori" data-reveal>
          <div className={styles.valuesIntro}>
            <span className={styles.lightEyebrow}>Ciò in cui crediamo</span>
            <h2>La tecnologia aiuta.<br />La fiducia fa partire.</h2>
            <p>Dietro ogni schermata, preventivo e conferma deve esserci una relazione che funziona.</p>
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
            <span className={styles.eyebrow}>Un mondo di possibilità</span>
            <h2>Il posto giusto è quello in cui ti riconosci.</h2>
          </div>
          <div className={styles.destinationRail}>
            <figure><Image src="/images/sharm.jpg" alt="Sharm el-Sheikh" fill sizes="30vw" /><figcaption>Sharm el-Sheikh <span>Mare</span></figcaption></figure>
            <figure><Image src="/images/newyork.jpg" alt="New York" fill sizes="30vw" /><figcaption>New York <span>City break</span></figcaption></figure>
            <figure><Image src="/images/dubai.jpg" alt="Dubai" fill sizes="30vw" /><figcaption>Dubai <span>Iconica</span></figcaption></figure>
            <figure><Image src="/images/maldive.jpg" alt="Maldive" fill sizes="30vw" /><figcaption>Maldive <span>Paradiso</span></figcaption></figure>
          </div>
        </section>

        <section className={styles.finalCta} data-reveal>
          <Image src="/images/sfondo-slide.png" alt="" fill sizes="96vw" aria-hidden="true" />
          <div className={styles.finalCtaContent}>
            <span className={styles.eyebrow}>Il prossimo viaggio può iniziare qui</span>
            <h2>Raccontaci dove vuoi andare.<br />Al resto pensiamo insieme.</h2>
            <div>
              <a href={whatsappUrl} target="_blank" rel="noreferrer">
                Inizia su WhatsApp
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M14 7l5 5-5 5" /></svg>
              </a>
              <Link href="/pacchetti">Esplora i pacchetti</Link>
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
