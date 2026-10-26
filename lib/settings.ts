import type { Settings } from "./booking-types";
export function normalizeSettings(raw: Settings): Settings {
  const result = { ...raw };
  const keys = ["infant_max_age", "child_max_age", "option_hours_agency", "option_hours_guest", "price_lock_amount", "deposit_percent", "quote_validity_days"] as const;
  for (const key of keys) { const value = Number(raw[key]); if (raw[key] == null || !Number.isFinite(value) || value < 0) throw new Error("Le regole di prenotazione non sono configurate correttamente. Contatta Queen Tour."); result[key] = value; }
  return result;
}
