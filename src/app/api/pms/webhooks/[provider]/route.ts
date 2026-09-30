import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { apiError } from "@/lib/booking/api-response";
import { getBookingRepository } from "@/lib/booking/repository";
import { BookingError } from "@/lib/booking/errors";
import { getPmsProvider } from "@/lib/pms";

export const runtime = "nodejs";

function keyMatches(received: string | null, expected: string) {
  if (!received) return false;
  const left = Buffer.from(received);
  const right = Buffer.from(expected);
  return left.length === right.length && timingSafeEqual(left, right);
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ provider: string }> },
) {
  try {
    const { provider: routeProvider } = await params;
    const provider = getPmsProvider();
    if (routeProvider !== provider.name) {
      throw new BookingError("NOT_FOUND", "ไม่พบ PMS provider", 404);
    }
    const expectedKey = process.env.PMS_WEBHOOK_KEY;
    if (!expectedKey || !keyMatches(request.headers.get("x-pms-webhook-key"), expectedKey)) {
      return NextResponse.json({ error: { code: "UNAUTHORIZED" } }, { status: 401 });
    }

    const event = await provider.handleWebhook(await request.json());
    const repository = getBookingRepository();
    if (!repository.recordEvent(event.eventId, provider.name)) {
      return NextResponse.json({ accepted: true, duplicate: true });
    }
    const booking = repository.findByProviderReservationId(event.providerReservationId);
    if (!booking) throw new BookingError("NOT_FOUND", "ไม่พบ reservation ที่อ้างอิง", 404);
    repository.updateStatus(booking.reference, event.status);
    return NextResponse.json({ accepted: true });
  } catch (error) {
    return apiError(error);
  }
}
