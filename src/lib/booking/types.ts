export type BookingStatus =
  | "pending"
  | "pending_payment"
  | "confirmed"
  | "failed"
  | "expired"
  | "cancelled";

export interface SearchCriteria {
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  rooms: number;
}

export interface PriceBreakdown {
  nightlyAverage: number;
  subtotal: number;
  taxes: number;
  fees: number;
  total: number;
  currency: "THB";
}

export interface RoomOffer {
  offerId: string;
  roomCode: string;
  roomName: string;
  roomNameEn: string;
  description: string;
  descriptionEn: string;
  image: string;
  capacity: number;
  beds: string;
  ratePlanCode: string;
  ratePlanName: string;
  cancellationPolicy: string;
  cancellationPolicyEn: string;
  expiresAt: string;
  price: PriceBreakdown;
}

export interface GuestDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  specialRequests?: string;
}

export interface CreateReservationRequest {
  offerId: string;
  criteria: SearchCriteria;
  guest: GuestDetails;
}

export interface ReservationResult {
  providerReservationId: string;
  status: BookingStatus;
  price: PriceBreakdown;
  paymentAction?: { type: "redirect"; url: string };
}

export interface BookingRecord {
  reference: string;
  provider: string;
  providerReservationId: string;
  idempotencyKey: string;
  status: BookingStatus;
  total: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
}

export interface PmsProvider {
  readonly name: string;
  searchAvailability(criteria: SearchCriteria): Promise<RoomOffer[]>;
  createReservation(
    request: CreateReservationRequest,
    idempotencyKey: string,
  ): Promise<ReservationResult>;
  getReservationStatus(providerReservationId: string): Promise<BookingStatus>;
  handleWebhook(payload: unknown): Promise<{
    eventId: string;
    providerReservationId: string;
    status: BookingStatus;
  }>;
}
