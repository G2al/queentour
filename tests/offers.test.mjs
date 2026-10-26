import test from "node:test";
import assert from "node:assert/strict";
import { offerModes, isStayOffer, offerPriceCaption } from "../lib/offers.ts";

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
test("prezzi delle cinque offerte: volo escluso/incluso e quota a servizio", () => {
  assert.equal(offerPriceCaption({ typeKey: "hotel_only", nights: 7 }), "a persona · 7 notti (volo escluso)");
  assert.equal(offerPriceCaption({ typeKey: "flight_hotel" }), "a persona · volo + hotel");
  assert.equal(offerPriceCaption({ typeKey: "full_package" }), "a persona · volo, hotel e transfer");
  assert.equal(offerPriceCaption({ typeKey: "excursion" }), "a persona");
  assert.equal(offerPriceCaption({ typeKey: "transfer" }), "a servizio");
});
