export type PackageType = "Soggiorno" | "Transfer" | "Escursione";
export type PriceUnit = "per_person" | "per_service";
export type PriceType = "gross" | "net";

export type ItineraryItem = { day: string; title: string; description: string };

export type PackagePeriod = {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  adultPrice: number | null;
  adultPriceGross?: number | null;
  extraBedAdultPrice: number | null;
  extraBedAdultPriceGross?: number | null;
  childPrice: number | null;
  childPriceGross?: number | null;
  infantPrice: number | null;
  infantPriceGross?: number | null;
  singleSupplement: number | null;
  singleSupplementGross?: number | null;
};

export type PackageHotel = {
  id: number;
  name: string;
  slug: string;
  stars: number | null;
  address: string | null;
  description: string | null;
  amenities: string[];
  images: string[];
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
  priceGross?: number | null;
  adultPrice?: number | null;
  adultPriceGross?: number | null;
  childPrice?: number | null;
  childPriceGross?: number | null;
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
  typeKey: "stay" | "transfer" | "excursion";
  price: number | null;
  priceGross?: number | null;
  priceUnit: PriceUnit;
  priceType: PriceType;
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
  transfer?: { included: boolean; price: number | null; priceGross?: number | null } | null;
  registrationFee?: number | null;
  registrationFeeGross?: number | null;
  ageRanges?: Record<string, { min: number; max: number | null }>;
  cancellationPolicy?: string | null;
  notes?: string | null;
  periods?: PackagePeriod[];
  excursions?: PackageExtra[];
  insurances?: PackageExtra[];
};

export type PackageFilters = {
  destinations: { name: string; slug: string; country: string }[];
  types: PackageType[];
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
