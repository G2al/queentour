import type { BookingMode, Flight, TravelPackage } from "@/app/data/travelPackages";

export type Passenger = {
  birth_date: string; first_name?: string; last_name?: string; gender?: "M" | "F" | "";
  tax_code?: string; nationality?: string; document_type?: "identity_card" | "passport" | "";
  document_number?: string; document_expiry?: string;
};
export type CartRoom = { room_type_id: number; passengers: number[] };
export type CartItem = {
  package_id: number; mode?: BookingMode; check_in?: string; check_out?: string;
  flight_id?: number; date?: string; rooms?: CartRoom[]; passengers?: number[];
};
export type StoredItem = { key: string; item: CartItem; product: TravelPackage };
export type CartState = { passengers: Passenger[]; entries: StoredItem[]; insurance_ids: number[]; price_lock: boolean };
export type CartRequest = { passengers: Passenger[]; items: CartItem[]; insurance_ids?: number[]; price_lock?: boolean };
export type QuoteLine = { passenger: number | null; label: string; amount: number };
export type QuoteRoom = { index: number; roomTypeId: number; roomType: string; passengers: number[]; lines: QuoteLine[]; total: number };
export type QuotedItem = {
  index: number; packageId: number; packageSlug: string; title: string; type: string; mode: BookingMode;
  startDate: string; endDate: string; nights: number; hotel: { id: number; name: string } | null;
  flight: Flight | null; rooms: QuoteRoom[]; passengers: number[]; lines: QuoteLine[]; total: number; available: boolean;
};
export type Totals = { items: number; insurances: number; priceLock: number; total: number; feePercent: number | null; feeAmount: number; amountDue: number; depositPercent: number; depositAmount: number };
export type QuotedInsurance = { id?: number; insuranceId?: number; name: string; type?: string; unitPrice: number; quantity: number; total: number };
export type CartQuote = { currency: string; passengers: { position: number; birthDate: string; age: number; ageCategory: string }[]; items: QuotedItem[]; insurances: QuotedInsurance[]; priceLock: { selected: boolean; amount: number }; totals: Totals; available: boolean; availabilityProblems: Record<string, string> };
export type Insurance = { id: number; name: string; type: string; typeLabel: string; description: string | null; pricePerPerson: number };
export type LegalPage = { id: number; title: string; slug: string; content: string; requiresAcceptance: boolean; updatedAt: string };
export type Settings = {
  infant_max_age: number; child_max_age: number; option_hours_agency: number; option_hours_guest: number;
  price_lock_amount: number; deposit_percent: number; quote_validity_days: number;
  company_name?: string; whatsapp_number?: string; contact_email?: string; contact_phone?: string; address?: string;
};
export type BookingStatus = "quote" | "option" | "confirmed" | "proforma_sent" | "proforma_viewed" | "deposit_received" | "paid" | "expired" | "cancelled";
export type BookingPassenger = { position: number; isLead: boolean; firstName: string | null; lastName: string | null; birthDate: string; gender: "M" | "F" | null; taxCode?: string | null; nationality?: string | null; documentType?: string | null; documentNumber?: string | null; documentExpiry?: string | null; ageCategory: string };
export type BookingItem = Omit<QuotedItem, "index" | "lines" | "available" | "rooms"> & {
  id: number; modeLabel: string; seats?: number; breakdown?: QuotedItem;
  rooms: { roomTypeId: number; roomType: string; checkIn: string; checkOut: string; passengers: number[]; total: number }[];
};
export type Booking = {
  id: number; code: string; accessToken?: string; status: BookingStatus; statusLabel: string; isAgencyBooking: boolean;
  contact: { firstName: string; lastName: string; email: string; phone: string }; agencyReference: string | null; notes: string | null;
  passengers: BookingPassenger[]; items: BookingItem[]; insurances: QuotedInsurance[]; priceLock: { selected: boolean; amount: number };
  totals: Totals; currency: string; quoteValidUntil: string | null; optionExpiresAt: string | null;
  confirmedAt: string | null; proformaSentAt: string | null; proformaViewedAt: string | null; cancelledAt: string | null; termsAcceptedAt: string | null;
  actions: { canOption: boolean; canConfirm: boolean; canCancel: boolean };
  documents: { quotePdfUrl: string | null; proformaUrl: string | null }; createdAt: string;
};
export type BookingAction = "quote" | "option" | "confirm";
export type BookingRequest = CartRequest & { action: BookingAction; contact: { first_name: string; last_name: string; email: string; phone: string }; terms_accepted: boolean; notes?: string; agency_reference?: string };
export type BookingList = { data: Booking[]; meta: { current_page: number; last_page: number; total: number; per_page: number }; links?: Record<string, string | null> };
