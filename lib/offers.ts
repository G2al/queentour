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

export function offerPriceCaption(product: Pick<TravelPackage, "typeKey" | "nights">): string {
  switch (product.typeKey) {
    case "hotel_only": return `a persona · ${product.nights} notti (volo escluso)`;
    case "flight_hotel": return "a persona · volo + hotel";
    case "full_package": return "a persona · volo, hotel e transfer";
    case "transfer": return "a servizio";
    case "excursion": return "a persona";
  }
}
