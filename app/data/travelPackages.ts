export type PackageType = "Solo soggiorno" | "Volo + hotel" | "Pacchetto completo" | "Transfer" | "Escursione";
export type OfferKey = "hotel_only" | "flight_hotel" | "full_package" | "transfer" | "excursion";
export type PriceUnit = "per_person" | "per_service";
export type BookingMode = "hotel_only" | "flight_hotel" | "excursion" | "transfer";
export type AgencyFee = { percent: number; amount: number; netPrice: number };
export type RoomType = { id: number; name: string; description?: string | null; maxOccupancy: number; supplementPerNight: number };
export type Flight = {
  id: number; departureAirport: string; departureAirportName: string; departureCity: string;
  outboundDate: string; returnDate: string; nights: number; carrier: string | null;
  outboundDetails?: string | null; returnDetails?: string | null;
  adultPrice: number; childPrice: number | null; infantPrice: number | null; seatsAvailable: number;
};

export type ItineraryItem = { day: string; title: string; description: string };

export type PackagePeriod = {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  adultPrice: number | null;
  extraBedAdultPrice: number | null;
  childPrice: number | null;
  infantPrice: number | null;
  singleSupplement: number | null;
};

export type PackageHotel = {
  id: number;
  name: string;
  slug?: string;
  stars: number | null;
  address: string | null;
  description: string | null;
  amenities: string[];
  images: string[];
  roomTypes: RoomType[];
};

export type PackageExtra = {
  id: number;
  name: string;
  description?: string | null;
  duration?: string | null;
  image?: string | null;
  type?: string;
  typeLabel?: string;
  price?: number | null;
  adultPrice?: number | null;
  childPrice?: number | null;
};

export type TravelPackage = {
  id: number;
  slug: string;
  title: string;
  destination: string;
  destinationSlug: string;
  country: string;
  location: string;
  image: string;
  gallery?: string[];
  type: PackageType;
  typeKey: OfferKey;
  category: "stay" | "transfer" | "excursion";
  flightIncluded: boolean;
  flightOptional: boolean;
  transferIncluded: boolean;
  price: number | null;
  pricePerNight?: number | null;
  agencyFee?: AgencyFee | null;
  bookingModes: BookingMode[];
  minNights?: number;
  flights?: Flight[];
  priceUnit: PriceUnit;
  currency: string;
  featured: boolean;
  days: number;
  nights: number;
  period: string;
  months: string[];
  departures: string[];
  board: string | null;
  stay: string | null;
  badge: string | null;
  description: string;
  longDescription: string;
  highlights: string[];
  included: string[];
  excluded: string[];
  itinerary: ItineraryItem[];
  validFrom?: string | null;
  validTo?: string | null;
  hotel?: PackageHotel | null;
  transfer?: { included: boolean; price: number | null } | null;
  registrationFee?: number | null;
  ageRanges?: Record<string, { min: number; max: number | null }>;
  cancellationPolicy?: string | null;
  notes?: string | null;
  periods?: PackagePeriod[];
  excursions?: PackageExtra[];
  insurances?: PackageExtra[];
};

export type PackageFilters = {
  destinations: { name: string; slug: string; country: string }[];
  types: { key: OfferKey; label: PackageType }[];
  airports: { code: string; city: string }[];
  departures: string[];
  boards: string[];
  days: number[];
  priceRange: { min: number; max: number };
};

export type PaginationMeta = {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  [key: string]: unknown;
};

export type PaginatedPackages = {
  data: TravelPackage[];
  links: Record<string, string | null>;
  meta: PaginationMeta;
};

export type Agency = {
  id: number;
  fee_percent: number;
  company_name: string;
  vat_number: string;
  tax_code: string | null;
  address: string;
  city: string;
  zip_code: string;
  province: string | null;
  country: string;
  phone: string | null;
  email: string | null;
  pec: string | null;
  sdi_code: string | null;
  contact_person: string | null;
  license_number: string | null;
};

export type AgencyUser = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  role: "agency";
  agency: Agency;
  created_at: string;
};

export type AuthResponse = { token: string; token_type: "Bearer"; user: AgencyUser };
export type ValidationErrors = Record<string, string[]>;
