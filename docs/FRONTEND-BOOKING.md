# Integrazione prenotazioni Queen Tour

Implementazione del contratto in `docs/API.md`. Nessun pagamento online, account solo per agenzie, importi sempre calcolati da Laravel.

## Configurazione

Usare la variabile già esistente, disponibile anche durante la build:

```env
API_URL=https://queentouradmin.deviommi.it/api/v1
```

In locale: `API_URL=http://127.0.0.1:8000/api/v1`.

Il token agenzia resta nel cookie `httpOnly`. Il browser comunica con `/api/travel/*`, che inoltra il Bearer a Laravel. Le risposte personali, i calcoli e le pratiche usano `no-store`. Il carrello salva in localStorage soltanto prodotti e viaggiatori; non salva né il token agenzia né il dettaglio della fee. I link personali delle pratiche ospite vengono salvati separatamente, secondo il contratto.

Per distribuire: installare le dipendenze, `npm run build`, riavviare l’app Node/Plesk con startup `server.js`. Non sono state aggiunte dipendenze runtime.

## File per fase

### 1. Catalogo e dettaglio

- `app/data/travelPackages.ts`: nuovo modello pubblico, agencyFee, bookingModes, voli, camere e periodi.
- `lib/api.ts`: chiamate API centralizzate, catalogo/auth e nuove operazioni di prenotazione.
- `lib/booking-types.ts`, `lib/format.ts`, `lib/settings.ts`: contratto richieste/risposte, euro con due decimali, date italiane, normalizzazione settings.
- `app/components/booking/PackagePrice.tsx`: prezzo pieno per tutti e dettaglio fee riservato.
- `app/pacchetti/PackageCatalog.tsx`, `app/pacchetti/[slug]/page.tsx`, relativo CSS: nuovo prezzo, listino a notte, hotel/galleria, configuratore.
- `next.config.ts`: autorizzato esplicitamente il dominio immagini del backend.
- `app/page.tsx`, `app/components/Footer.tsx`, `Hero.tsx`, `JourneySteps.tsx`, `ContactModal.tsx`, `PackagesCarousel.tsx`, pagine Egitto/Chi siamo/Contatti: recensioni demo nascoste e testi aggiornati dove incompatibili con il volo + hotel.

### 2. Configuratore

- `app/components/booking/BookingConfigurator.tsx`: soggiorno o volo + hotel, aeroporto, date, camere, occupanti, riuso viaggiatori, calcolo/preverifica server.
- `app/components/booking/BookingFields.tsx`: campi viaggiatori e messaggi 422 annidati.
- `app/components/booking/useResources.ts`: caricamento e retry di impostazioni, assicurazioni e testi legali.
- `app/components/booking/booking.module.css`: componenti responsive coerenti con il design del sito.

### 3. Carrello

- `lib/cart.ts`: persistenza, inserimento/modifica, riuso persone e riallineamento degli indici dopo una rimozione.
- `app/components/booking/CartProvider.tsx`: stato condiviso, recupero da localStorage, sincronizzazione schede e sessione agenzia.
- `app/components/booking/useCartQuote.ts`: preventivi con debounce, annullamento richieste superate e protezione dai prezzi non più aggiornati.
- `app/components/booking/CartPage.tsx`, `CartItemEditor.tsx`, `PriceSummary.tsx`: prodotti, camere, righe di costo, assicurazioni, blocca prezzo, acconto e importo dovuto.
- `app/components/booking/CartLink.tsx`, `CartLink.module.css`: carrello con contatore desktop/mobile.
- `app/layout.tsx`, `app/components/HeaderClient.tsx`, relativo CSS: provider, link carrello e area pratiche.
- `app/carrello/page.tsx`, `layout.tsx`: nuova pagina carrello.

### 4. Checkout e condizioni

- `app/checkout/page.tsx`: accesso diretto alla fase dati del carrello.
- `app/components/booking/LegalAcceptance.tsx`: checkbox per ogni testo attivo che richiede accettazione, con versione della pagina.
- `app/condizioni/[slug]/page.tsx`, `app/condizioni/error.tsx`: documenti HTML dal backend in iframe sandbox, con gestione errori/404.
- `app/api/travel/[...path]/route.ts`, `lib/client-api.ts`, `lib/route-utils.ts`: proxy con percorsi ammessi, controllo origine, errori 422 conservati, 401/logout, 429 e 5xx gestiti.

### 5. Pratiche

- `app/components/booking/BookingView.tsx`: stato, prodotti/camere/viaggiatori, totali, PDF, opzione con conto alla rovescia, completamento anagrafiche, condizioni, conferma, annullamento esplicito e proforma.
- `app/pratica/layout.tsx`, `[code]/page.tsx`, `[code]/not-found.tsx`, `loading.tsx`, `error.tsx`: caricamento privato lato server, link personale e protezione dall’indicizzazione.

### 6. Agenzie

- `app/area-agenzie/registrati/RegisterForm.tsx`: provincia, telefono ed email agenzia obbligatori.
- `app/area-agenzie/profilo/ProfileForm.tsx`, relativa pagina: fee sola lettura e aggiornamenti parziali; corretto anche il riferimento al form dopo una richiesta asincrona.
- `app/area-agenzie/accedi/page.tsx`, `registrati/page.tsx`: testi allineati al nuovo modello.
- `app/area-agenzie/pratiche/page.tsx`, `AgencyBookings.tsx`, `loading.tsx`, `error.tsx`: elenco protetto, filtro per stato e paginazione.

### Verifiche

- `tests/cart.test.mjs`, script `test:unit` in `package.json`.
- `scripts/verify-booking-api.mjs`: integrazione su frontend e backend locali; crea pratiche riconoscibili e le elimina nel teardown.
- `scripts/verify-booking-browser.mjs`: verifica Chrome tramite CDP, con browser isolato. Nessuna dipendenza aggiuntiva.

## Come provare

### Ospite: più prodotti e stesso gruppo

1. Aprire una proposta soggiorno. Scegliere modalità/date oppure aeroporto/volo, aggiungere camera e date di nascita.
2. Attendere il prezzo indicativo e aggiungere al carrello.
3. Aprire un’escursione o un transfer. Nelle persone scegliere i viaggiatori già presenti, anziché duplicarli.
4. Aprire il carrello. Verificare righe per persona e camera, prezzo totale, eventuali assicurazioni e blocca prezzo.
5. Modificare un prodotto/camera e ricaricare la pagina: dati e indici devono restare coerenti.

### Ospite: preventivo → opzione → conferma

1. Nel checkout compilare il referente. Per il preventivo sono sufficienti le date di nascita dei viaggiatori.
2. Richiedere preventivo: viene creata la pratica, svuotato il carrello e mostrato il link personale da conservare.
3. Aprire il PDF. Per bloccare in opzione completare nomi/cognomi/sesso e accettare tutti i documenti richiesti.
4. Verificare la scadenza e il conto alla rovescia. Confermare l’opzione: il cliente riceve la conferma e le indicazioni sul contatto per il pagamento.
5. Su un altro preventivo/opzione provare l’annullamento con conferma esplicita.

### Agenzia: conferma → proforma

1. Accedere con `agenzia@tourflow.test` / `password` nell’ambiente demo.
2. Verificare che il prezzo principale sia uguale a quello dell’ospite. Aprire “Vedi la tua fee”.
3. Configurare e confermare una proposta; nel checkout sono disponibili riferimento pratica e dettaglio fee/importo da versare.
4. Nella pratica leggere l’avviso: **aprire la proforma rende definitiva la prenotazione**. Il documento viene aperto soltanto su clic, senza prefetch.
5. Tornare alla pratica: lo stato viene aggiornato al ritorno nella finestra o con “Aggiorna stato”.
6. Provare “Le mie pratiche”, filtro stato e paginazione. Il profilo espone `fee_percent` senza consentirne la modifica.

### Errori e indisponibilità

- Camera senza adulto, persone duplicate, date/notti non valide: correggere il campo o la camera indicata.
- Se `available=false`, il preventivo rimane consentito, opzione/conferma sono disabilitate.
- Disattivare il backend: i dati del carrello restano salvati e vengono mostrati retry/errori.
- Link pratica senza token e senza agenzia proprietaria: “Pratica non trovata o link non valido”.
- Token agenzia scaduto: il cookie viene cancellato dai Route Handler e l’interfaccia torna da ospite.

## Eseguire i test

Unitari (Node 22.6+ con supporto allo strip dei tipi, usato Node 24 nella verifica):

```powershell
npm run test:unit
```

API: backend locale acceso e frontend locale sulla porta 3001. Lo script rifiuta domini non locali. Il teardown usa PHP e il repository Laravel indicato da `TEST_BACKEND_PATH` (default: il progetto tourflow a fianco del frontend).

```powershell
$env:PORT='3001'
node server.js
```

In un altro terminale:

```powershell
node scripts/verify-booking-api.mjs
```

Il test browser richiede Chrome headless con porta debug 9224 e profilo temporaneo isolato. Eseguirlo separatamente dal test API per non consumare insieme il limite di dieci operazioni al minuto.

```powershell
node scripts/verify-booking-browser.mjs
```

## Esito delle verifiche finali

- `npm run build`: compilazione di produzione e controllo TypeScript completati.
- `npm run test:unit`: 8 test superati.
- Verifica API locale superata: carrello con soggiorno, escursione e transfer condivisi da due adulti, un bambino e un infant; assicurazione e blocca prezzo; errore camera senza adulto; preventivo/PDF; opzione, conferma, annullamento e scadenza; autenticazione agenzia, fee, volo + hotel, elenco filtrato e proforma definitiva dopo apertura.
- Verifica browser superata: configuratore, riuso viaggiatori, persistenza dopo ricarica, checkout reale, link personale, annullamento e area agenzie. Verificata anche un’indisponibilità simulata: preventivo consentito, opzione e conferma disabilitate.
- Layout carrello verificato a 390 px senza overflow orizzontale; nessuna eccezione JavaScript durante il percorso browser.
- Le pratiche create esclusivamente dai test sono state eliminate al termine. Nessun test è stato eseguito sul backend di produzione.

## Riscontri sul backend

- Le impostazioni numeriche sono attualmente restituite come stringhe. Il frontend le normalizza e non usa importi/durate fissi sostitutivi.
- Durante i test è comparsa una migrazione backend aggiuntiva, `2026_10_27_100000_add_option_reminders_to_bookings`, inizialmente pendente: il passaggio a opzione falliva con colonna `option_reminders_sent` mancante. Prima dei test finali risultava già applicata. In produzione verificare che anche questa migrazione sia eseguita.
- Non risultano campi mancanti rispetto alle sei fasi del contratto. I contatti e le immagini demo vanno sostituiti nel backend con quelli reali prima della messa online.
- Nessuna modifica è stata pubblicata o applicata al backend di produzione.
