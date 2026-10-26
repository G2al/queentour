import test from "node:test";
import assert from "node:assert/strict";
import { offerModes, isStayOffer, offerPriceCaption, offerDuration } from "../lib/offers.ts";

test("solo soggiorno: il volo si può aggiungere soltanto se facoltativo e abilitato", () => {
  const stay = { typeKey: "hotel_only", bookingModes: ["hotel_only", "flight_hotel"], flightOptional: false };
  assert.deepEqual(offerModes(stay), ["hotel_only"]);
  assert.deepEqual(offerModes({ ...stay, flightOptional: true }), ["hotel_only", "flight_hotel"]);
  assert.deepEqual(offerModes({ ...stay, flightOptional: true, bookingModes: ["hotel_only"] }), ["hotel_only"]);
});
for (const typeKey of ["flight_hotel", "full_package"]) {
  test(`${typeKey}: mai date libere, anche se bookingModes contiene hotel_only`, () => {
    const product = { typeKey, type: "Etichetta cambiata", bookingModes: ["hotel_only", "flight_hotel"], flightOptional: true };
    assert.deepEqual(offerModes(product), ["flight_hotel"]);
    assert.equal(isStayOffer(product), true);
  });
}
for (const typeKey of ["excursion", "transfer"]) {
  test(`${typeKey}: flusso persone e data indipendente dall’etichetta`, () => {
    const product = { typeKey, type: "Etichetta cambiata", bookingModes: [typeKey], flightOptional: false };
    assert.deepEqual(offerModes(product), [typeKey]);
    assert.equal(isStayOffer(product), false);
  });
}
test("priceBasis determina l’unità, il volo conserva le notti abbinate", () => {
  assert.equal(offerPriceCaption({ priceBasis: "per_night", nights: 3 }), "a notte");
  assert.equal(offerPriceCaption({ priceBasis: "per_person", flightIncluded: true, nights: 7 }), "a persona · hotel + volo per 7 notti");
  assert.equal(offerPriceCaption({ priceBasis: "per_person", flightIncluded: true, transferIncluded: true, nights: 4 }), "a persona · hotel + volo per 4 notti · transfer incluso");
  assert.equal(offerPriceCaption({ priceBasis: "per_person", flightIncluded: false }), "a persona");
  assert.equal(offerPriceCaption({ priceBasis: "per_service" }), "a servizio");
});
test("solo soggiorno: durata libera o minima, mai durata fissa", () => {
  assert.equal(offerDuration({ typeKey: "hotel_only", nights: 1, days: 2 }), "Scegli tu le date");
  assert.equal(offerDuration({ typeKey: "hotel_only", nights: 3, days: 4 }), "Minimo 3 notti");
  assert.equal(offerDuration({ typeKey: "flight_hotel", nights: 7, days: 8 }), "8 giorni / 7 notti");
  assert.equal(offerDuration({ typeKey: "excursion", nights: 0, days: 1 }), "Esperienza giornaliera");
});
