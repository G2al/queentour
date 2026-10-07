import Link from "next/link";
import styles from "./WhyQueenTour.module.css";

const benefits = [
  {
    title: "Viaggi davvero su misura",
    description: "Ogni proposta nasce dai tuoi desideri, dal tuo budget e dal tuo modo di viaggiare.",
    icon: "sparkles",
  },
  {
    title: "Assistenza sempre presente",
    description: "Ti accompagniamo prima, durante e dopo la partenza con un supporto diretto e umano.",
    icon: "support",
  },
  {
    title: "Esperienze selezionate",
    description: "Scegliamo strutture, voli e attività affidabili per farti vivere solo il meglio.",
    icon: "compass",
  },
  {
    title: "Parti senza pensieri",
    description: "Organizziamo ogni dettaglio del viaggio, così a te resta soltanto il piacere di partire.",
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
          <span className={styles.eyebrow}>Il valore di Queen Tour</span>
          <h2 id="why-queen-tour-title">
            Perché scegliere<br />Queen Tour?
          </h2>
          <p>
            Non vendiamo semplicemente vacanze. Ascoltiamo le tue idee e le trasformiamo
            in un viaggio costruito con attenzione, esperienza e cura.
          </p>
          <Link className={styles.button} href="/pacchetti">
            Scopri i pacchetti
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
