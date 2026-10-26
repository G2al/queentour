# Offerte e voli abbinati

Adeguamento al contratto aggiornato di `API.md`, sezioni 1 e 3. La logica usa `typeKey`; `type` rimane l’etichetta mostrata. Tutti gli importi arrivano dal backend, senza sommare il volo al prezzo di catalogo.

## File modificati e creati

- `app/data/travelPackages.ts`: cinque offerte, categoria, flag inclusioni, filtri con chiavi/etichette e aeroporti.
- `lib/offers.ts` (nuovo): modalità ammesse e descrizione del prezzo per offerta, indipendenti dalle etichette.
- `lib/api.ts`: parametro `airport`; catalogo, filtri e dettaglio senza cache persistente per evitare vecchi contratti e partenze obsolete.
- `app/components/booking/OfferFeatures.tsx` (nuovo) e `booking.module.css`: indicazioni con icone per volo incluso/facoltativo e transfer incluso.
- `app/components/booking/PackagePrice.tsx`: prezzi delle cinque offerte, prezzo su richiesta, quota a notte solo per il solo soggiorno.
- `app/components/booking/BookingConfigurator.tsx`: date libere per solo soggiorno, scelta con/senza volo se consentita, volo obbligatorio per volo + hotel e pacchetto completo, partenze abbinate, blocco senza voli.
- `app/pacchetti/PackageCatalog.tsx`: filtro offerta per chiave, nuovo aeroporto, indicazioni di inclusione sulle card.
- `app/pacchetti/page.tsx`: lettura e inoltro del filtro aeroporto anche al primo caricamento da URL.
- `app/pacchetti/[slug]/page.tsx`: inclusioni e listino coerenti con la categoria dell’offerta.
- `app/components/Hero.tsx`: ricerca iniziale con chiavi e testi dei filtri API.
- `app/components/PackagesCarousel.tsx` e relativo CSS: etichetta offerta, inclusioni e descrizioni prezzo aggiornate anche nell’anteprima.
- `tests/offers.test.mjs` (nuovo), `package.json`: test delle cinque offerte aggiunti ai test del carrello.
- `scripts/verify-offers-api.mjs`, `scripts/verify-offers-browser.mjs` (nuovi): verifiche senza creazione pratiche o invio email.
- Questo documento.

`docs/API.md` era già stato aggiornato e fornito prima dell’intervento: non è stato riscritto dal frontend.

## Come provare le cinque offerte

| Offerta | Prova | Risultato atteso |
| --- | --- | --- |
| Solo soggiorno | Aprire `/pacchetti?type=hotel_only`, scegliere una proposta e inserire date, camera e nascite. Su quella con volo facoltativo passare a “Con volo”. | “Senza volo”: date libere e `hotel_only`; “Con volo”: aeroporto/partenza e `flight_hotel`. La quota del catalogo indica volo escluso. |
| Volo + hotel | Aprire `/pacchetti?type=flight_hotel`, poi una proposta con voli abbinati. | Volo incluso, aeroporto e volo obbligatori, nessun check-in/out libero. Item `flight_hotel`; prezzo di catalogo già comprensivo del volo. |
| Pacchetto completo | Aprire `/pacchetti?type=full_package`, per esempio Sharm el Sheikh Resort & Spa nei dati locali. | Volo e transfer inclusi; aeroporto, volo, camera e nascite; item `flight_hotel`. |
| Escursione | Aprire `/pacchetti?type=excursion`, per esempio Orange Bay. | Una data e persone con nascita, nessuna camera. Quota a persona. |
| Transfer | Aprire `/pacchetti?type=transfer`, per esempio transfer aeroporto Hurghada. | Una data e persone con nascita, nessuna camera. Quota a servizio per tutto il gruppo. |

Per ogni prodotto completato attendere il preventivo e aggiungere al carrello. Carrello, checkout e azioni della pratica mantengono il contratto precedente. Per verificare catalogo e configuratore non occorre creare una pratica.

Provare `/pacchetti?type=full_package&airport=NAP`, poi cambiare aeroporto dal filtro “Partenza da”: i risultati devono essere offerte complete con voli abbinati da quell’aeroporto. Provare anche reset filtri e larghezza mobile.

Su un’offerta con volo senza partenze, devono comparire “Nessuna partenza disponibile al momento” e il pulsante di aggiunta/salvataggio disabilitato. Nel solo soggiorno senza volo facoltativo la scelta con/senza volo non compare.

## Verifiche eseguite

- Build di produzione e TypeScript superati.
- 14 test unitari superati, inclusi i test precedenti del carrello.
- API locali: preventivi reali per solo soggiorno, aggiunta del volo facoltativo, pacchetto completo, escursione e transfer; filtro combinato offerta/aeroporto verificato sui voli del dettaglio.
- Browser: ricerca homepage, filtri da URL e interattivi, quattro offerte reali presenti, layout a 390 px senza overflow e nessuna eccezione JavaScript.
- Il catalogo locale non contiene una proposta autonoma `flight_hotel`: il relativo configuratore è stato verificato con fixture nel solo browser, senza alterare prodotti del backend. Con lo stesso metodo verificato il caso senza partenze.
- Nessuna pratica creata, nessuna registrazione, nessuna apertura proforma e nessuna email inviata da queste verifiche.

Per ripetere le verifiche: frontend di produzione locale sulla porta 3001, backend locale disponibile e Chrome isolato con debug sulla porta 9224 per il test browser.

```powershell
npm run test:unit
node --experimental-strip-types scripts/verify-offers-api.mjs
node scripts/verify-offers-browser.mjs
```

## Riscontri sul backend

Non sono emersi campi mancanti rispetto al nuovo contratto nelle risposte locali controllate. Il solo limite dei dati di prova è l’assenza di un prodotto autonomo `flight_hotel`: non è un endpoint mancante. Per completare una verifica end-to-end su quel prodotto occorre pubblicarne uno con voli abbinati dal pannello.

Le nuove verifiche non usano i precedenti script che creano pratiche. Per qualsiasi prova futura di registrazione/preventivo/opzione/conferma su un backend che invia email reali, usare contatti e credenziali reali concordati; non usare indirizzi demo `example.test` o `tourflow.test`.
