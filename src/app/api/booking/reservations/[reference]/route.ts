import { NextResponse } from "next/server";
import { apiError } from "@/lib/booking/api-response";
import { getBooking } from "@/lib/booking/service";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ reference: string }> },
) {
  try {
    const { reference } = await params;
    return NextResponse.json({ booking: getBooking(reference) });
  } catch (error) {
    return apiError(error);
  }
}
