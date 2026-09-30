import { NextResponse } from "next/server";
import { apiError } from "@/lib/booking/api-response";
import { createReservationSchema } from "@/lib/booking/schemas";
import { createBooking } from "@/lib/booking/service";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const idempotencyKey = request.headers.get("idempotency-key");
    if (!idempotencyKey || idempotencyKey.length < 16 || idempotencyKey.length > 100) {
      return NextResponse.json(
        { error: { code: "INVALID_REQUEST", message: "ไม่พบ idempotency key" } },
        { status: 400 },
      );
    }
    const input = createReservationSchema.parse(await request.json());
    const result = await createBooking(input, idempotencyKey);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return apiError(error);
  }
}
