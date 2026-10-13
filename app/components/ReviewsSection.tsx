import styles from "./ReviewsSection.module.css";

const reviews = [
  { quote: "Resort bellissimo e proposta chiarissima. Sapevamo esattamente cosa era incluso.", name: "Cliente Hurghada", trip: "Soggiorno All Inclusive", color: "coral" },
  { quote: "L’autista ci aspettava all’arrivo: dopo il volo non dover pensare a nulla è stato impagabile.", name: "Cliente Sahl Hasheesh", trip: "Transfer privato", color: "peach" },
  { quote: "Orange Bay sembra davvero una cartolina. Organizzazione puntuale e giornata stupenda.", name: "Cliente Giftun", trip: "Escursione in barca", color: "yellow" },
  { quote: "Ci hanno consigliato la zona più adatta ai bambini e avevano ragione su tutto.", name: "Famiglia a Makadi Bay", trip: "Vacanza in famiglia", color: "mint" },
  { quote: "Assistenza veloce, consigli concreti e nessuna sorpresa sul prezzo finale.", name: "Cliente Hurghada", trip: "Hotel + transfer", color: "sky" },
  { quote: "Il safari al tramonto è stato uno dei momenti più belli della vacanza.", name: "Cliente Desert Safari", trip: "Escursione nel deserto", color: "lilac" },
  { quote: "Cercavamo solo l’hotel perché avevamo già il volo. Queen Tour ha capito subito.", name: "Cliente El Gouna", trip: "Formula Solo Land", color: "pink" },
  { quote: "Struttura elegante, baia tranquilla e assistenza sempre raggiungibile.", name: "Cliente Sahl Hasheesh", trip: "Soggiorno premium", color: "aqua" },
  { quote: "Transfer di andata e ritorno coordinati alla perfezione con i nostri orari.", name: "Cliente Hurghada", trip: "Transfer aeroporto", color: "yellow" },
  { quote: "Ci hanno evitato un resort non adatto alle nostre esigenze e proposto quello giusto.", name: "Coppia a Makadi Bay", trip: "Consulenza hotel", color: "coral" },
  { quote: "Snorkeling meraviglioso e barca curata. Esperienza che rifaremmo domani.", name: "Cliente Mar Rosso", trip: "Giftun Island", color: "sky" },
  { quote: "Comunicazione gentile e concreta, anche quando abbiamo cambiato l’orario all’ultimo.", name: "Cliente Soma Bay", trip: "Assistenza locale", color: "mint" },
  { quote: "Una vacanza semplice da organizzare: hotel, transfer e due escursioni in un’unica proposta.", name: "Cliente Hurghada", trip: "Pacchetto personalizzato", color: "peach" },
  { quote: "Ottimo equilibrio tra giornate di relax e attività. Mai una corsa, mai un’attesa.", name: "Cliente Makadi Bay", trip: "Mare e deserto", color: "lilac" },
  { quote: "Il vantaggio vero è parlare con qualcuno che conosce bene la destinazione.", name: "Cliente Egitto", trip: "Viaggio di coppia", color: "pink" },
  { quote: "Prezzi trasparenti e suggerimenti utili. Ci siamo sentiti seguiti dall’Italia all’hotel.", name: "Cliente Mar Rosso", trip: "Solo Land", color: "aqua" },
];

function UserIcon() {
  return <svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="11.5" r="5" /><path d="M7.5 27c.7-5.2 3.5-8 8.5-8s7.8 2.8 8.5 8" /></svg>;
}

function ReviewCard({ review }: { review: (typeof reviews)[number] }) {
  return (
    <article className={`${styles.card} ${styles[review.color]}`}>
      <span className={styles.quoteMark} aria-hidden="true">“</span>
      <div className={styles.stars} aria-label="5 stelle su 5"><span>★</span><span>★</span><span>★</span><span>★</span><span>★</span></div>
      <blockquote>{review.quote}</blockquote>
      <div className={styles.person}><span className={styles.avatar}><UserIcon /></span><div><strong>{review.name}</strong><span>{review.trip}</span></div></div>
    </article>
  );
}

function ReviewGroup({ items, hidden = false }: { items: typeof reviews; hidden?: boolean }) {
  return <div className={styles.group} aria-hidden={hidden || undefined}>{items.map((review) => <ReviewCard review={review} key={`${review.name}-${review.trip}`} />)}</div>;
}

const firstRow = reviews.slice(0, 8);
const secondRow = reviews.slice(8);

export default function ReviewsSection() {
  return (
    <section className={styles.section} id="recensioni" aria-labelledby="reviews-title">
      <div className={styles.heading}>
        <span>Storie dal Mar Rosso</span>
        <h2 id="reviews-title">Il loro Egitto, raccontato così.</h2>
        <p>Recensioni dimostrative da sostituire con testimonianze verificate dei clienti Queen Tour.</p>
      </div>
      <div className={styles.rows}>
        <div className={styles.marquee}><div className={`${styles.track} ${styles.trackLeft}`}><ReviewGroup items={firstRow} /><ReviewGroup items={firstRow} hidden /></div></div>
        <div className={styles.marquee}><div className={`${styles.track} ${styles.trackRight}`}><ReviewGroup items={secondRow} /><ReviewGroup items={secondRow} hidden /></div></div>
      </div>
    </section>
  );
}
