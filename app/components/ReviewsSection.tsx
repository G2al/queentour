import styles from "./ReviewsSection.module.css";

const reviews = [
  {
    quote: "Organizzazione precisa e proposta costruita davvero intorno alle nostre esigenze.",
    name: "Cliente Thailandia",
    trip: "Viaggio di coppia",
    color: "coral",
  },
  {
    quote: "Ci siamo sentiti accompagnati in ogni momento, dalla prenotazione fino al rientro.",
    name: "Cliente New York",
    trip: "City break",
    color: "peach",
  },
  {
    quote: "Un itinerario equilibrato, strutture bellissime e assistenza sempre disponibile.",
    name: "Cliente Maldive",
    trip: "Viaggio relax",
    color: "yellow",
  },
  {
    quote: "Queen Tour ha trasformato la nostra idea in un viaggio ancora più bello del previsto.",
    name: "Cliente Messico",
    trip: "Tour e mare",
    color: "mint",
  },
  {
    quote: "Tutto semplice, chiaro e ben organizzato. Abbiamo pensato soltanto a goderci la vacanza.",
    name: "Cliente Dubai",
    trip: "Esperienza premium",
    color: "sky",
  },
  {
    quote: "La cura dei dettagli ha fatto la differenza. Un servizio attento e davvero personale.",
    name: "Cliente Sharm",
    trip: "Vacanza in famiglia",
    color: "lilac",
  },
  {
    quote: "Consigli utili, risposte veloci e una selezione di esperienze perfetta per noi.",
    name: "Cliente Giappone",
    trip: "Tour culturale",
    color: "pink",
  },
  {
    quote: "È stato bello avere un unico riferimento disponibile per ogni dubbio o necessità.",
    name: "Cliente Zanzibar",
    trip: "Viaggio di nozze",
    color: "aqua",
  },
  {
    quote: "Voli, hotel e trasferimenti coordinati alla perfezione. Partiremmo di nuovo domani.",
    name: "Cliente Caraibi",
    trip: "Vacanza al mare",
    color: "yellow",
  },
  {
    quote: "Una proposta originale e mai standardizzata, pensata rispettando tempi e budget.",
    name: "Cliente Bali",
    trip: "Viaggio su misura",
    color: "coral",
  },
  {
    quote: "Abbiamo scoperto luoghi meravigliosi grazie a un itinerario curato nei minimi dettagli.",
    name: "Cliente Islanda",
    trip: "Tour panoramico",
    color: "sky",
  },
  {
    quote: "Assistenza gentile e concreta. Anche una piccola variazione è stata gestita subito.",
    name: "Cliente Grecia",
    trip: "Vacanza tra amici",
    color: "mint",
  },
  {
    quote: "Ottimo equilibrio tra giornate organizzate e tempo libero per vivere la destinazione.",
    name: "Cliente Spagna",
    trip: "Tour europeo",
    color: "peach",
  },
  {
    quote: "La soluzione ideale per il nostro budget, senza rinunciare alla qualità che cercavamo.",
    name: "Cliente Egitto",
    trip: "Mare e cultura",
    color: "lilac",
  },
  {
    quote: "Un viaggio sereno dall'inizio alla fine, con tutte le informazioni sempre a portata di mano.",
    name: "Cliente Portogallo",
    trip: "Viaggio itinerante",
    color: "pink",
  },
  {
    quote: "Esperienza fantastica e comunicazione impeccabile. Ci siamo sentiti davvero ascoltati.",
    name: "Cliente Mauritius",
    trip: "Viaggio romantico",
    color: "aqua",
  },
];

function UserIcon() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <circle cx="16" cy="11.5" r="5" />
      <path d="M7.5 27c.7-5.2 3.5-8 8.5-8s7.8 2.8 8.5 8" />
    </svg>
  );
}

function ReviewCard({ review }: { review: (typeof reviews)[number] }) {
  return (
    <article className={`${styles.card} ${styles[review.color]}`}>
      <span className={styles.quoteMark} aria-hidden="true">“</span>
      <div className={styles.stars} aria-label="5 stelle su 5">
        <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
      </div>
      <blockquote>{review.quote}</blockquote>
      <div className={styles.person}>
        <span className={styles.avatar}><UserIcon /></span>
        <div>
          <strong>{review.name}</strong>
          <span>{review.trip}</span>
        </div>
      </div>
    </article>
  );
}

function ReviewGroup({ items, hidden = false }: { items: typeof reviews; hidden?: boolean }) {
  return (
    <div className={styles.group} aria-hidden={hidden || undefined}>
      {items.map((review) => <ReviewCard review={review} key={review.name} />)}
    </div>
  );
}

const firstRow = reviews.slice(0, 8);
const secondRow = reviews.slice(8);

export default function ReviewsSection() {
  return (
    <section className={styles.section} id="recensioni" aria-labelledby="reviews-title">
      <div className={styles.heading}>
        <span>Recensioni dimostrative</span>
        <h2 id="reviews-title">Cosa dicono i viaggiatori?</h2>
        <p>
          Esempi grafici da sostituire con testimonianze verificate dei clienti Queen Tour.
        </p>
      </div>

      <div className={styles.rows}>
        <div className={styles.marquee}>
          <div className={`${styles.track} ${styles.trackLeft}`}>
            <ReviewGroup items={firstRow} />
            <ReviewGroup items={firstRow} hidden />
          </div>
        </div>

        <div className={styles.marquee}>
          <div className={`${styles.track} ${styles.trackRight}`}>
            <ReviewGroup items={secondRow} />
            <ReviewGroup items={secondRow} hidden />
          </div>
        </div>
      </div>
    </section>
  );
}
