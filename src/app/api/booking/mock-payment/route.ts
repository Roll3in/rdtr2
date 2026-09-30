import { NextResponse } from "next/server";
import { apiError } from "@/lib/booking/api-response";
import { getBookingRepository } from "@/lib/booking/repository";
import { mockPaymentSchema } from "@/lib/booking/schemas";
import { BookingError } from "@/lib/booking/errors";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    if ((process.env.PMS_PROVIDER ?? "mock") !== "mock") {
      throw new BookingError("NOT_FOUND", "ไม่พบ endpoint", 404);
    }
    const input = mockPaymentSchema.parse(await request.json());
    const repository = getBookingRepository();
    const booking = repository.findByReference(input.reference);
    if (!booking) throw new BookingError("NOT_FOUND", "ไม่พบหมายเลขการจอง", 404);
    repository.updateStatus(input.reference, input.outcome);
    return NextResponse.json({ reference: input.reference, status: input.outcome });
  } catch (error) {
    return apiError(error);
  }
}
