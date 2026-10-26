import type { BookingMode, TravelPackage } from "../app/data/travelPackages.ts";

export function isStayOffer(product: Pick<TravelPackage, "typeKey">) {
  return ["hotel_only", "flight_hotel", "full_package"].includes(product.typeKey);
}

export function offerModes(product: Pick<TravelPackage, "typeKey" | "bookingModes" | "flightOptional">): BookingMode[] {
  const allowed: BookingMode[] = product.typeKey === "hotel_only"
    ? product.flightOptional ? ["hotel_only", "flight_hotel"] : ["hotel_only"]
    : product.typeKey === "flight_hotel" || product.typeKey === "full_package"
      ? ["flight_hotel"] : [product.typeKey];
  return allowed.filter((mode) => product.bookingModes?.includes(mode));
}

export function offerPriceCaption(product: Pick<TravelPackage, "priceBasis" | "flightIncluded" | "transferIncluded" | "nights">): string {
  switch (product.priceBasis) {
    case "per_night": return "a notte";
    case "per_person": return product.flightIncluded
      ? `a persona · hotel + volo per ${product.nights} ${product.nights === 1 ? "notte" : "notti"}${product.transferIncluded ? " · transfer incluso" : ""}`
      : "a persona";
    case "per_service": return "a servizio";
  }
}

export function offerDuration(product: Pick<TravelPackage, "typeKey" | "nights" | "days">): string {
  if (product.typeKey === "hotel_only") return product.nights > 1 ? `Minimo ${product.nights} notti` : "Scegli tu le date";
  return product.days === 1 ? "Esperienza giornaliera" : `${product.days} giorni / ${product.nights} ${product.nights === 1 ? "notte" : "notti"}`;
}
