export type TravelPackage = {
  slug: string;
  title: string;
  destination: string;
  country: string;
  location: string;
  image: string;
  rating: number;
  reviews: number;
  type: "Mare" | "City break" | "Tour" | "Luna di miele";
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
    slug: "thailandia-da-sogno",
    title: "Thailandia da sogno",
    destination: "Thailandia",
    country: "Thailandia",
    location: "Bangkok e Phuket",
    image: "/images/thailandia.jpg",
    rating: 4.9,
    reviews: 128,
    type: "Tour",
    price: 1490,
    days: 10,
    nights: 7,
    period: "Da novembre ad aprile",
    months: ["Novembre", "Dicembre", "Gennaio", "Febbraio", "Marzo", "Aprile"],
    departures: ["Roma", "Milano"],
    board: "Colazione inclusa",
    stay: "Hotel e resort 4★",
    badge: "Più richiesto",
    description: "Templi, mercati, mare tropicale e isole da cartolina in un unico viaggio.",
    longDescription:
      "Un itinerario pensato per scoprire due anime della Thailandia: l'energia di Bangkok e la natura tropicale di Phuket. La proposta alterna visite, tempo libero e giornate di mare, con strutture selezionate e assistenza Queen Tour.",
    highlights: ["Bangkok", "Templi storici", "Phuket", "Escursione alle isole Phi Phi"],
    included: ["Volo A/R dall'Italia", "7 pernottamenti", "Colazione", "Trasferimenti principali", "Assistenza Queen Tour"],
    excluded: ["Assicurazione annullamento", "Pasti non indicati", "Escursioni facoltative", "Mance e spese personali"],
    itinerary: [
      { day: "Giorni 1–3", title: "Bangkok", description: "Arrivo, sistemazione e visite ai principali templi e mercati della capitale." },
      { day: "Giorno 4", title: "Verso Phuket", description: "Volo interno e trasferimento al resort selezionato." },
      { day: "Giorni 5–8", title: "Mare e isole", description: "Relax, escursione alle Phi Phi e tempo libero sulle spiagge di Phuket." },
      { day: "Giorni 9–10", title: "Rientro", description: "Ultime ore libere, trasferimento in aeroporto e volo per l'Italia." },
    ],
  },
  {
    slug: "new-york-experience",
    title: "New York Experience",
    destination: "New York",
    country: "Stati Uniti",
    location: "Manhattan, New York",
    image: "/images/newyork.jpg",
    rating: 4.8,
    reviews: 94,
    type: "City break",
    price: 1290,
    days: 6,
    nights: 5,
    period: "Tutto l'anno",
    months: ["Tutto l'anno"],
    departures: ["Roma", "Milano", "Napoli"],
    board: "Solo pernottamento",
    stay: "Hotel centrale 4★",
    badge: "City icon",
    description: "Cinque notti nel cuore di Manhattan per vivere tutta l'energia della città.",
    longDescription:
      "Una proposta flessibile per esplorare New York con i tuoi ritmi. L'hotel centrale consente di raggiungere facilmente Times Square, Central Park, Fifth Avenue e i quartieri più autentici della città.",
    highlights: ["Times Square", "Central Park", "Statua della Libertà", "Top of the Rock"],
    included: ["Volo A/R dall'Italia", "5 pernottamenti", "Bagaglio da stiva", "Trasferimento condiviso", "Assistenza Queen Tour"],
    excluded: ["ESTA", "Resort fee ove prevista", "Pasti", "Ingressi ed escursioni facoltative"],
    itinerary: [
      { day: "Giorno 1", title: "Benvenuti a New York", description: "Arrivo, trasferimento e prima passeggiata tra Times Square e Broadway." },
      { day: "Giorni 2–3", title: "Manhattan", description: "Midtown, Central Park, Fifth Avenue e osservatorio panoramico." },
      { day: "Giorni 4–5", title: "Downtown e Brooklyn", description: "Statua della Libertà, Financial District e tramonto dal Brooklyn Bridge." },
      { day: "Giorno 6", title: "Rientro", description: "Tempo libero e trasferimento in aeroporto." },
    ],
  },
  {
    slug: "sharm-el-sheikh-all-inclusive",
    title: "Sharm El Sheikh",
    destination: "Sharm El Sheikh",
    country: "Egitto",
    location: "Mar Rosso",
    image: "/images/sharm.jpg",
    rating: 4.9,
    reviews: 176,
    type: "Mare",
    price: 749,
    days: 8,
    nights: 7,
    period: "Tutto l'anno",
    months: ["Tutto l'anno"],
    departures: ["Napoli", "Roma", "Milano"],
    board: "All Inclusive",
    stay: "Resort 5★",
    badge: "Miglior prezzo",
    description: "Una settimana di mare, barriera corallina e relax con formula All Inclusive.",
    longDescription:
      "La soluzione ideale per chi desidera staccare davvero. Resort fronte mare, formula All Inclusive e la possibilità di aggiungere snorkeling, escursioni nel deserto e visite naturalistiche.",
    highlights: ["Resort fronte mare", "Barriera corallina", "Ras Mohammed", "Deserto del Sinai"],
    included: ["Volo charter A/R", "7 pernottamenti", "All Inclusive", "Trasferimenti", "Assistenza in loco"],
    excluded: ["Visto d'ingresso ove richiesto", "Assicurazione annullamento", "Escursioni", "Mance"],
    itinerary: [
      { day: "Giorno 1", title: "Arrivo sul Mar Rosso", description: "Trasferimento, sistemazione e inizio del soggiorno All Inclusive." },
      { day: "Giorni 2–4", title: "Mare e relax", description: "Giornate libere tra spiaggia, piscina e barriera corallina." },
      { day: "Giorni 5–7", title: "Esperienze facoltative", description: "Possibilità di visitare Ras Mohammed o vivere il tramonto nel deserto." },
      { day: "Giorno 8", title: "Rientro", description: "Trasferimento in aeroporto e volo per l'Italia." },
    ],
  },
  {
    slug: "colori-del-messico",
    title: "Colori del Messico",
    destination: "Messico",
    country: "Messico",
    location: "Yucatán e Riviera Maya",
    image: "/images/messico.jpg",
    rating: 4.7,
    reviews: 83,
    type: "Tour",
    price: 1890,
    days: 11,
    nights: 9,
    period: "Da novembre a maggio",
    months: ["Novembre", "Dicembre", "Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio"],
    departures: ["Roma", "Milano"],
    board: "Colazione e All Inclusive",
    stay: "Hotel e resort 4★",
    badge: "Tour + mare",
    description: "Cultura maya, città coloniali e mare caraibico in un itinerario completo.",
    longDescription:
      "Un viaggio che unisce la storia dello Yucatán al relax della Riviera Maya. Visiterai siti archeologici, cenote e città coloniali prima di concludere il soggiorno in un resort sul Mar dei Caraibi.",
    highlights: ["Chichén Itzá", "Cenote", "Valladolid", "Riviera Maya"],
    included: ["Volo A/R", "9 pernottamenti", "Tour guidato", "Soggiorno mare All Inclusive", "Trasferimenti"],
    excluded: ["Tasse locali", "Assicurazione annullamento", "Pasti non indicati", "Escursioni facoltative"],
    itinerary: [
      { day: "Giorni 1–3", title: "Mérida e Valladolid", description: "Città coloniali, mercati e tradizioni dello Yucatán." },
      { day: "Giorni 4–5", title: "Mondo Maya", description: "Visita di Chichén Itzá e bagno in un cenote selezionato." },
      { day: "Giorni 6–9", title: "Riviera Maya", description: "Soggiorno All Inclusive e giornate libere sul Mar dei Caraibi." },
      { day: "Giorni 10–11", title: "Rientro", description: "Trasferimento e volo notturno per l'Italia." },
    ],
  },
  {
    slug: "dubai-esclusiva",
    title: "Dubai esclusiva",
    destination: "Dubai",
    country: "Emirati Arabi Uniti",
    location: "Dubai",
    image: "/images/dubai.jpg",
    rating: 4.8,
    reviews: 109,
    type: "City break",
    price: 1190,
    days: 6,
    nights: 5,
    period: "Da ottobre ad aprile",
    months: ["Ottobre", "Novembre", "Dicembre", "Gennaio", "Febbraio", "Marzo", "Aprile"],
    departures: ["Roma", "Milano", "Napoli"],
    board: "Colazione inclusa",
    stay: "Hotel 5★",
    badge: "Premium",
    description: "Skyline, deserto e spiagge dorate in un soggiorno elegante e personalizzabile.",
    longDescription:
      "Dubai sorprende con contrasti continui: architettura futuristica, souk tradizionali, spiagge e deserto. La proposta include una struttura 5 stelle e tempo sufficiente per personalizzare ogni giornata.",
    highlights: ["Burj Khalifa", "Dubai Marina", "Safari nel deserto", "Old Dubai"],
    included: ["Volo A/R", "5 pernottamenti", "Colazione", "Trasferimenti privati", "Safari nel deserto"],
    excluded: ["Tassa di soggiorno", "Assicurazione annullamento", "Pasti non indicati", "Ingressi facoltativi"],
    itinerary: [
      { day: "Giorno 1", title: "Arrivo a Dubai", description: "Trasferimento privato e sistemazione in hotel 5 stelle." },
      { day: "Giorni 2–3", title: "Icone della città", description: "Downtown, Burj Khalifa, Marina e tempo libero per lo shopping." },
      { day: "Giorni 4–5", title: "Deserto e tradizione", description: "Safari al tramonto e visita facoltativa dei quartieri storici." },
      { day: "Giorno 6", title: "Rientro", description: "Colazione, trasferimento e volo per l'Italia." },
    ],
  },
  {
    slug: "maldive-paradisiache",
    title: "Maldive paradisiache",
    destination: "Maldive",
    country: "Maldive",
    location: "Atollo di Malé",
    image: "/images/maldive.jpg",
    rating: 5,
    reviews: 142,
    type: "Luna di miele",
    price: 2390,
    days: 9,
    nights: 7,
    period: "Da novembre ad aprile",
    months: ["Novembre", "Dicembre", "Gennaio", "Febbraio", "Marzo", "Aprile"],
    departures: ["Roma", "Milano"],
    board: "All Inclusive",
    stay: "Water villa 5★",
    badge: "Viaggio romantico",
    description: "Una villa sull'oceano, acque trasparenti e servizi esclusivi in All Inclusive.",
    longDescription:
      "Un soggiorno pensato per chi cerca privacy, mare e servizi di alto livello. La water villa selezionata affaccia direttamente sulla laguna e il trattamento All Inclusive rende ogni giornata completamente rilassante.",
    highlights: ["Water villa", "Laguna privata", "Snorkeling", "Cena romantica"],
    included: ["Volo A/R", "7 pernottamenti", "All Inclusive", "Transfer in barca veloce", "Assistenza Queen Tour"],
    excluded: ["Green tax ove prevista", "Assicurazione annullamento", "Escursioni premium", "Trattamenti spa"],
    itinerary: [
      { day: "Giorno 1", title: "Partenza", description: "Volo notturno verso Malé." },
      { day: "Giorno 2", title: "Arrivo in paradiso", description: "Transfer in barca e sistemazione nella water villa." },
      { day: "Giorni 3–8", title: "Laguna e relax", description: "Giornate libere tra snorkeling, spiaggia, spa ed esperienze facoltative." },
      { day: "Giorno 9", title: "Rientro", description: "Ultima colazione, trasferimento a Malé e volo per l'Italia." },
    ],
  },
];

export function getTravelPackage(slug: string) {
  return travelPackages.find((travelPackage) => travelPackage.slug === slug);
}
