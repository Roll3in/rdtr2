import "server-only";
import { randomBytes } from "node:crypto";
import { BookingError } from "./errors";
import { getBookingRepository } from "./repository";
import type { CreateReservationRequest } from "./types";
import { getPmsProvider } from "@/lib/pms";

function reference() {
  return `RR-${randomBytes(4).toString("hex").toUpperCase()}`;
}

export async function createBooking(
  request: CreateReservationRequest,
  idempotencyKey: string,
) {
  const repository = getBookingRepository();
  const existing = repository.findByIdempotencyKey(idempotencyKey);
  if (existing) return { booking: existing, paymentAction: undefined };

  const provider = getPmsProvider();
  const result = await provider.createReservation(request, idempotencyKey);
  const now = new Date().toISOString();
  const booking = {
    reference: reference(),
    provider: provider.name,
    providerReservationId: result.providerReservationId,
    idempotencyKey,
    status: result.status,
    total: result.price.total,
    currency: result.price.currency,
    createdAt: now,
    updatedAt: now,
  } as const;
  repository.create(booking);

  const paymentAction =
    provider.name === "mock"
      ? { type: "redirect" as const, url: `/booking/mock-pay?reference=${booking.reference}` }
      : result.paymentAction;
  return { booking, paymentAction };
}

export function getBooking(referenceValue: string) {
  const booking = getBookingRepository().findByReference(referenceValue);
  if (!booking) throw new BookingError("NOT_FOUND", "ไม่พบหมายเลขการจอง", 404);
  return booking;
}
