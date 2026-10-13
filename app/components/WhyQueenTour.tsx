import Link from "next/link";
import styles from "./WhyQueenTour.module.css";

const benefits = [
  {
    title: "Specialisti di Hurghada",
    description: "Conosciamo zone, strutture e distanze: ogni consiglio nasce da una competenza precisa.",
    icon: "sparkles",
  },
  {
    title: "Hotel selezionati",
    description: "Valutiamo posizione, servizi e atmosfera per proporti il resort davvero adatto a te.",
    icon: "support",
  },
  {
    title: "Transfer coordinati",
    description: "Dall’aeroporto all’hotel, organizziamo spostamenti chiari, puntuali e senza passaggi inutili.",
    icon: "compass",
  },
  {
    title: "Escursioni autentiche",
    description: "Mare, deserto e cultura: scegliamo esperienze affidabili per scoprire l’Egitto oltre il resort.",
    icon: "shield",
  },
];

function BenefitIcon({ name }: { name: string }) {
  if (name === "support") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 13v-2a8 8 0 0 1 16 0v2" />
        <path d="M4 12h2.5v6H5a2 2 0 0 1-2-2v-2a2 2 0 0 1 1-2ZM20 12h-2.5v6H19a2 2 0 0 0 2-2v-2a2 2 0 0 0-1-2ZM17.5 18c-.7 1.3-2 2-4 2" />
      </svg>
    );
  }

  if (name === "compass") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="8.5" />
        <path d="m15.5 8.5-2.1 4.9-4.9 2.1 2.1-4.9 4.9-2.1Z" />
      </svg>
    );
  }

  if (name === "shield") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 3 5.5 5.8v5.4c0 4.2 2.6 7.7 6.5 9.8 3.9-2.1 6.5-5.6 6.5-9.8V5.8L12 3Z" />
        <path d="m8.8 12 2.1 2.1 4.5-4.5" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m12 3 1.3 4.1L17 9l-3.7 1.9L12 15l-1.3-4.1L7 9l3.7-1.9L12 3Z" />
      <path d="m18.5 14 .7 2.3 2.3.7-2.3.7-.7 2.3-.7-2.3-2.3-.7 2.3-.7.7-2.3Z" />
    </svg>
  );
}

function BenefitCards() {
  return benefits.map((benefit, index) => (
    <article className={styles.card} key={benefit.title}>
      <span className={styles.cardNumber}>0{index + 1}</span>
      <span className={styles.icon}>
        <BenefitIcon name={benefit.icon} />
      </span>
      <div>
        <h3>{benefit.title}</h3>
        <p>{benefit.description}</p>
      </div>
    </article>
  ));
}

export default function WhyQueenTour() {
  return (
    <section className={styles.section} id="chi-siamo" aria-labelledby="why-queen-tour-title">
      <div className={styles.content}>
        <div className={styles.intro}>
          <span className={styles.eyebrow}>Una specializzazione vera</span>
          <h2 id="why-queen-tour-title">
            Conosciamo l’Egitto.<br />Non lo improvvisiamo.
          </h2>
          <p>
            Ci concentriamo su una destinazione per conoscerla davvero. Così ogni proposta
            è più precisa, ogni risposta più utile, ogni esperienza più serena.
          </p>
          <Link className={styles.button} href="/pacchetti">
            Esplora Hurghada
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M5 12h14M14 7l5 5-5 5" />
            </svg>
          </Link>
        </div>

        <div className={styles.cardsViewport} aria-label="I vantaggi di Queen Tour">
          <div className={styles.cardsTrack}>
            <div className={styles.cardsGroup}>
              <BenefitCards />
            </div>
            <div className={styles.cardsGroup} aria-hidden="true">
              <BenefitCards />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
