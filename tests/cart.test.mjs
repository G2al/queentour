import test from "node:test";
import assert from "node:assert/strict";
import { EMPTY_CART, cartRequest, compactCart, readCart, saveConfiguredItem } from "../lib/cart.ts";
import { ageAt, addDays } from "../lib/format.ts";
import { normalizeSettings } from "../lib/settings.ts";

const product = { id: 1, slug: "test-hotel", title: "Test", agencyFee: { percent: 10, amount: 20, netPrice: 180 } };
const people = [{ birth_date: "1985-03-10" }, { birth_date: "1987-07-22" }];
const stay = { passengers: people, items: [{ package_id: 1, mode: "hotel_only", check_in: "2027-02-01", check_out: "2027-02-08", rooms: [{ room_type_id: 1, passengers: [0, 1] }] }] };
test("riutilizza gli stessi passeggeri tra soggiorno ed escursione", () => {
  const first = saveConfiguredItem(EMPTY_CART, product, stay, [null, null], "stay");
  const second = saveConfiguredItem(first, { ...product, id: 2, slug: "test-excursion" }, { passengers: people, items: [{ package_id: 2, date: "2027-02-03", passengers: [0, 1] }] }, [0, 1], "excursion");
  assert.equal(second.passengers.length, 2); assert.equal(second.entries.length, 2); assert.deepEqual(second.entries[1].item.passengers, [0, 1]);
  assert.equal(second.entries[0].product.agencyFee, undefined);
  assert.equal(cartRequest(second).items.length, 2);
});
test("rimuovere un prodotto compatta e riallinea gli indici senza perdere persone condivise", () => {
  const cart = { passengers: [...people, { birth_date: "2015-01-01" }], insurance_ids: [1], price_lock: true, entries: [{ key: "a", product, item: { package_id: 1, passengers: [0, 1] } }, { key: "b", product, item: { package_id: 2, passengers: [1, 2] } }] };
  const result = compactCart({ ...cart, entries: cart.entries.slice(1) });
  assert.deepEqual(result.passengers, cart.passengers.slice(1)); assert.deepEqual(result.entries[0].item.passengers, [0, 1]);
});
test("modifica camere e occupanti senza duplicare il prodotto", () => {
  const cart = saveConfiguredItem(EMPTY_CART, product, stay, [null, null], "stay");
  const next = saveConfiguredItem(cart, product, { passengers: [people[1]], items: [{ ...stay.items[0], rooms: [{ room_type_id: 3, passengers: [0] }] }] }, [1], "stay");
  assert.equal(next.entries.length, 1); assert.equal(next.passengers.length, 1); assert.equal(next.entries[0].item.rooms[0].room_type_id, 3); assert.deepEqual(next.entries[0].item.rooms[0].passengers, [0]);
});
test("rifiuta carrelli con riferimenti a passeggeri inesistenti", () => {
  assert.throws(() => readCart(JSON.stringify({ ...EMPTY_CART, passengers: people, entries: [{ key: "bad", product, item: { package_id: 1, passengers: [9] } }] })));
});
test("rimuovere tutto azzera assicurazioni e blocca prezzo", () => {
  assert.deepEqual(compactCart({ ...EMPTY_CART, passengers: people, insurance_ids: [1], price_lock: true }), EMPTY_CART);
});
test("limite di 16 viaggiatori su tutta la pratica", () => {
  const list = Array.from({ length: 17 }, () => people[0]);
  assert.throws(() => saveConfiguredItem(EMPTY_CART, product, { passengers: list, items: [{ package_id: 1, passengers: list.map((_, i) => i) }] }, list.map(() => null), "too-many"));
});
test("età calcolata alla data del servizio, incluso il diciottesimo compleanno", () => {
  assert.equal(ageAt("2008-11-14", "2026-11-13"), 17); assert.equal(ageAt("2008-11-14", "2026-11-14"), 18); assert.equal(addDays("2028-02-28", 1), "2028-02-29");
});
test("normalizza i valori stringa realmente restituiti da settings", () => {
  const settings = normalizeSettings({ infant_max_age: "1", child_max_age: "17", option_hours_agency: "72", option_hours_guest: "6", price_lock_amount: "49", deposit_percent: "30", quote_validity_days: "7" });
  assert.equal(settings.child_max_age, 17); assert.equal(settings.price_lock_amount, 49); assert.throws(() => normalizeSettings({}));
});
