export type TravelPackage = {
  slug: string;
  title: string;
  destination: string;
  country: string;
  location: string;
  image: string;
  rating: number;
  reviews: number;
  type: "Soggiorno" | "Transfer" | "Escursione";
  price: number;
  days: number;
  nights: number;
  period: string;
  months: string[];
  departures: string[];
  board: string;
  stay: string;
  badge: string;
  description: string;
  longDescription: string;
  highlights: string[];
  included: string[];
  excluded: string[];
  itinerary: { day: string; title: string; description: string }[];
};

export const travelPackages: TravelPackage[] = [
  {
    slug: "hurghada-all-inclusive",
    title: "Hurghada All Inclusive",
    destination: "Hurghada",
    country: "Egitto",
    location: "Hurghada · Mar Rosso",
    image: "/images/egypt-hotel.png",
    rating: 4.9,
    reviews: 118,
    type: "Soggiorno",
    price: 490,
    days: 8,
    nights: 7,
    period: "Tutto l’anno",
    months: ["Tutto l’anno"],
    departures: ["Aeroporto di Hurghada", "Hotel Hurghada"],
    board: "All Inclusive",
    stay: "Resort 5 stelle",
    badge: "Più richiesto",
    description: "Sette notti in resort sul Mar Rosso, con formula All Inclusive e assistenza dedicata.",
    longDescription: "Una settimana a Hurghada pensata per chi vuole mare, comfort e zero pensieri una volta arrivato in Egitto. Selezioniamo il resort più adatto alle tue esigenze e possiamo aggiungere transfer privato ed escursioni su misura.",
    highlights: ["Resort sul mare", "All Inclusive", "Assistenza locale", "Formula flessibile"],
    included: ["7 pernottamenti", "Trattamento All Inclusive", "Assistenza Queen Tour", "Selezione personalizzata del resort"],
    excluded: ["Volo A/R dall’Italia", "Transfer aeroportuale se non richiesto", "Escursioni facoltative", "Visto e assicurazione"],
    itinerary: [
      { day: "Giorno 1", title: "Benvenuti a Hurghada", description: "Arrivo autonomo, eventuale transfer riservato e sistemazione nel resort selezionato." },
      { day: "Giorni 2–3", title: "Mar Rosso e relax", description: "Tempo libero tra spiaggia, piscina e servizi All Inclusive del resort." },
      { day: "Giorni 4–6", title: "L’Egitto che scegli tu", description: "Possibilità di aggiungere Orange Bay, safari nel deserto o una giornata a Luxor." },
      { day: "Giorni 7–8", title: "Ultimi momenti sul mare", description: "Relax, check-out ed eventuale transfer privato verso l’aeroporto." },
    ],
  },
  {
    slug: "sahl-hasheesh-premium",
    title: "Sahl Hasheesh Premium",
    destination: "Sahl Hasheesh",
    country: "Egitto",
    location: "Sahl Hasheesh · Hurghada",
    image: "/images/egypt-hurghada-hero.png",
    rating: 4.9,
    reviews: 76,
    type: "Soggiorno",
    price: 690,
    days: 8,
    nights: 7,
    period: "Tutto l’anno",
    months: ["Tutto l’anno"],
    departures: ["Aeroporto di Hurghada"],
    board: "All Inclusive",
    stay: "Resort premium 5 stelle",
    badge: "Premium",
    description: "Un soggiorno elegante nella baia più raffinata di Hurghada, tra mare limpido e quiete.",
    longDescription: "Sahl Hasheesh è la scelta giusta per chi cerca un’atmosfera più raccolta e servizi di livello. Proponiamo strutture selezionate direttamente sul mare, con assistenza per organizzare ogni dettaglio a terra.",
    highlights: ["Baia esclusiva", "Spiaggia privata", "Resort premium", "Atmosfera rilassata"],
    included: ["7 pernottamenti", "Trattamento All Inclusive", "Assistenza Queen Tour", "Consulenza sulla struttura"],
    excluded: ["Volo A/R dall’Italia", "Transfer aeroportuale se non richiesto", "Escursioni", "Visto e assicurazione"],
    itinerary: [
      { day: "Giorno 1", title: "Arrivo nella baia", description: "Accoglienza su richiesta, sistemazione e primo tramonto sul Mar Rosso." },
      { day: "Giorni 2–4", title: "Comfort e mare", description: "Giornate dedicate alla spiaggia, al resort e ai ritmi lenti della baia." },
      { day: "Giorni 5–7", title: "Esperienze facoltative", description: "Escursioni in barca, snorkeling o safari nel deserto organizzabili su richiesta." },
      { day: "Giorno 8", title: "Check-out", description: "Ultima colazione ed eventuale transfer privato verso l’aeroporto." },
    ],
  },
  {
    slug: "makadi-bay-family",
    title: "Makadi Bay Family",
    destination: "Makadi Bay",
    country: "Egitto",
    location: "Makadi Bay · Hurghada",
    image: "/images/sharm.jpg",
    rating: 4.8,
    reviews: 91,
    type: "Soggiorno",
    price: 540,
    days: 8,
    nights: 7,
    period: "Tutto l’anno",
    months: ["Tutto l’anno"],
    departures: ["Aeroporto di Hurghada"],
    board: "All Inclusive",
    stay: "Family resort 5 stelle",
    badge: "Ideale famiglie",
    description: "Resort family-friendly, spiaggia comoda e servizi pensati per grandi e piccoli.",
    longDescription: "Makadi Bay offre spazi ampi, mare accessibile e ottimi resort per le famiglie. Ti aiutiamo a scegliere la struttura giusta in base all’età dei bambini, ai servizi desiderati e al budget disponibile.",
    highlights: ["Family resort", "Spiaggia accessibile", "Mini club", "All Inclusive"],
    included: ["7 pernottamenti", "Trattamento All Inclusive", "Assistenza Queen Tour", "Consulenza dedicata alle famiglie"],
    excluded: ["Volo A/R dall’Italia", "Transfer aeroportuale se non richiesto", "Escursioni", "Visto e assicurazione"],
    itinerary: [
      { day: "Giorno 1", title: "Arrivo a Makadi Bay", description: "Sistemazione in resort e orientamento tra servizi, ristoranti e aree family." },
      { day: "Giorni 2–4", title: "Mare per tutta la famiglia", description: "Spiaggia, piscine, attività e tanto tempo da vivere insieme." },
      { day: "Giorni 5–7", title: "Una giornata speciale", description: "Possibilità di aggiungere un’uscita in barca o un’esperienza nel deserto." },
      { day: "Giorno 8", title: "Rientro", description: "Check-out ed eventuale transfer organizzato per l’aeroporto." },
    ],
  },
  {
    slug: "transfer-privato-hurghada",
    title: "Transfer privato Hurghada",
    destination: "Hurghada",
    country: "Egitto",
    location: "Aeroporto · Hotel · Aeroporto",
    image: "/images/egypt-transfer.png",
    rating: 5,
    reviews: 64,
    type: "Transfer",
    price: 35,
    days: 1,
    nights: 0,
    period: "Ogni giorno, 24/7",
    months: ["Tutto l’anno"],
    departures: ["Aeroporto di Hurghada", "Hotel Hurghada"],
    board: "Servizio privato",
    stay: "Veicolo riservato",
    badge: "Arrivo senza stress",
    description: "Autista dedicato e veicolo privato per raggiungere il tuo hotel senza attese.",
    longDescription: "Il modo più semplice per iniziare e concludere il soggiorno. Monitoriamo l’orario di arrivo, organizziamo il punto d’incontro e ti accompagniamo direttamente in struttura con un veicolo riservato.",
    highlights: ["Servizio privato", "Assistenza arrivo", "Orario monitorato", "Prezzo trasparente"],
    included: ["Veicolo privato", "Autista dedicato", "Monitoraggio dell’arrivo", "Assistenza Queen Tour"],
    excluded: ["Volo A/R dall’Italia", "Attese extra non comunicate", "Fermate aggiuntive", "Mance facoltative"],
    itinerary: [
      { day: "Prima dell’arrivo", title: "Conferma dei dettagli", description: "Raccogliamo numero del volo, orario e struttura di destinazione." },
      { day: "All’atterraggio", title: "Incontro con l’autista", description: "Troverai il riferimento concordato nel punto d’incontro comunicato." },
      { day: "Durante il transfer", title: "Diretti in hotel", description: "Viaggio privato, senza soste per altri passeggeri." },
      { day: "All’arrivo", title: "Benvenuti in vacanza", description: "Ti lasciamo direttamente all’ingresso della struttura." },
    ],
  },
  {
    slug: "orange-bay-giftun",
    title: "Orange Bay & Giftun",
    destination: "Giftun Island",
    country: "Egitto",
    location: "Partenza da Hurghada",
    image: "/images/egypt-excursion.png",
    rating: 4.9,
    reviews: 143,
    type: "Escursione",
    price: 55,
    days: 1,
    nights: 0,
    period: "Tutto l’anno",
    months: ["Tutto l’anno"],
    departures: ["Hotel Hurghada", "Marina Hurghada"],
    board: "Pranzo incluso",
    stay: "Escursione giornaliera",
    badge: "Icona del Mar Rosso",
    description: "Una giornata tra lagune turchesi, snorkeling e relax sulle isole Giftun.",
    longDescription: "Scopri uno dei volti più luminosi del Mar Rosso con una giornata in barca verso Orange Bay. Sono previste soste snorkeling, tempo sulla spiaggia e pranzo a bordo, con transfer dall’hotel organizzabile.",
    highlights: ["Orange Bay", "Soste snorkeling", "Pranzo a bordo", "Mare cristallino"],
    included: ["Navigazione in barca", "Soste snorkeling", "Pranzo e bevande analcoliche", "Guida e attrezzatura base"],
    excluded: ["Volo A/R dall’Italia", "Ingresso area protetta ove previsto", "Servizi premium in spiaggia", "Mance facoltative"],
    itinerary: [
      { day: "Mattina", title: "Partenza dalla marina", description: "Imbarco, briefing e navigazione verso le acque delle isole Giftun." },
      { day: "Prima sosta", title: "Snorkeling sul reef", description: "Bagno guidato in uno dei tratti di barriera più belli della zona." },
      { day: "Pomeriggio", title: "Relax a Orange Bay", description: "Tempo libero sulla spiaggia e pranzo durante l’escursione." },
      { day: "Tramonto", title: "Rientro a Hurghada", description: "Navigazione di ritorno ed eventuale transfer verso l’hotel." },
    ],
  },
  {
    slug: "desert-safari-hurghada",
    title: "Desert Safari Sunset",
    destination: "Deserto di Hurghada",
    country: "Egitto",
    location: "Eastern Desert · Hurghada",
    image: "/images/egypt-desert.png",
    rating: 4.8,
    reviews: 87,
    type: "Escursione",
    price: 45,
    days: 1,
    nights: 0,
    period: "Tutto l’anno",
    months: ["Tutto l’anno"],
    departures: ["Hotel Hurghada", "Hotel Makadi Bay"],
    board: "Cena inclusa",
    stay: "Esperienza pomeridiana",
    badge: "Tramonto nel deserto",
    description: "Quad, paesaggi desertici e cena beduina sotto i colori del tramonto egiziano.",
    longDescription: "Un pomeriggio fuori dal comune tra piste desertiche, montagne e luce dorata. L’esperienza combina attività, scoperta e una cena in atmosfera beduina prima del rientro in hotel.",
    highlights: ["Tour in quad", "Villaggio beduino", "Tramonto", "Cena tradizionale"],
    included: ["Transfer dall’hotel", "Guida locale", "Attività in quad", "Cena e bevande analcoliche"],
    excluded: ["Volo A/R dall’Italia", "Foto e video", "Accessori personali", "Mance facoltative"],
    itinerary: [
      { day: "Pomeriggio", title: "Partenza dall’hotel", description: "Transfer verso la base nel deserto e briefing di sicurezza." },
      { day: "Nel deserto", title: "Avventura in quad", description: "Percorso guidato tra piste sabbiose e montagne dell’Eastern Desert." },
      { day: "Al tramonto", title: "Atmosfera beduina", description: "Sosta panoramica, visita e cena in stile tradizionale." },
      { day: "Sera", title: "Rientro in hotel", description: "Transfer organizzato al termine dell’esperienza." },
    ],
  },
];

export function getTravelPackage(slug: string) {
  return travelPackages.find((travelPackage) => travelPackage.slug === slug);
}
