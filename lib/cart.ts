import type { CartItem, CartRequest, CartState, Passenger, StoredItem } from "./booking-types";
import type { TravelPackage } from "@/app/data/travelPackages";

export const EMPTY_CART: CartState = { passengers: [], entries: [], insurance_ids: [], price_lock: false };
export const CART_KEY = "queentour-cart-v2";
export function itemPassengers(item: CartItem) { return [...new Set(item.rooms ? item.rooms.flatMap((room) => room.passengers) : item.passengers ?? [])]; }
export function cartRequest(cart: CartState): CartRequest { return { passengers: cart.passengers, items: cart.entries.map((entry) => entry.item), insurance_ids: cart.insurance_ids, price_lock: cart.price_lock }; }
export function compactCart(cart: CartState): CartState {
  const used = [...new Set(cart.entries.flatMap((entry) => itemPassengers(entry.item)))].sort((a, b) => a - b);
  const remap = (index: number) => used.indexOf(index);
  const entries = cart.entries.map((entry) => ({ ...entry, item: { ...entry.item, ...(entry.item.rooms ? { rooms: entry.item.rooms.map((room) => ({ ...room, passengers: room.passengers.map(remap) })) } : { passengers: entry.item.passengers?.map(remap) }) } }));
  return { ...cart, entries, passengers: used.map((index) => cart.passengers[index]), ...(entries.length ? {} : { insurance_ids: [], price_lock: false }) };
}
export function saveConfiguredItem(cart: CartState, product: TravelPackage, configuration: CartRequest, reuse: (number | null)[], key: string): CartState {
  const passengers = [...cart.passengers];
  const positions = configuration.passengers.map((person, index) => {
    const existing = reuse[index];
    if (existing != null && cart.passengers[existing]) return existing;
    passengers.push({ ...person }); return passengers.length - 1;
  });
  const item = configuration.items[0];
  const mapped: CartItem = { ...item, ...(item.rooms ? { rooms: item.rooms.map((room) => ({ ...room, passengers: room.passengers.map((index) => positions[index]) })) } : { passengers: item.passengers?.map((index) => positions[index]) }) };
  const { agencyFee: ignoredFee, ...publicProduct } = product;
  void ignoredFee;
  const entry: StoredItem = { key, item: mapped, product: publicProduct };
  const found = cart.entries.some((current) => current.key === key);
  if (!found && cart.entries.length >= 10) throw new Error("Puoi inserire al massimo 10 prodotti nella pratica.");
  const result = compactCart({ ...cart, passengers, entries: found ? cart.entries.map((current) => current.key === key ? entry : current) : [...cart.entries, entry] });
  if (result.passengers.length > 16) throw new Error("Una pratica può contenere al massimo 16 persone. Riutilizza i viaggiatori già presenti quando sono gli stessi.");
  return result;
}
export function readCart(raw: string | null): CartState {
  if (!raw) return EMPTY_CART;
  const value = JSON.parse(raw) as CartState;
  if (!Array.isArray(value.passengers) || !Array.isArray(value.entries) || value.entries.length > 10 || value.passengers.length > 16) throw new Error("Carrello non valido.");
  if (!value.passengers.every((person: Passenger) => typeof person.birth_date === "string")) throw new Error("Viaggiatori non validi.");
  for (const entry of value.entries) {
    if (!entry?.item || typeof entry.key !== "string" || !entry.product?.slug || !Number.isFinite(entry.item.package_id)) throw new Error("Prodotto non valido.");
    if (itemPassengers(entry.item).some((index) => !Number.isInteger(index) || index < 0 || index >= value.passengers.length)) throw new Error("Assegnazione persone non valida.");
  }
  return compactCart({ ...value, insurance_ids: Array.isArray(value.insurance_ids) ? value.insurance_ids : [], price_lock: value.price_lock === true });
}
