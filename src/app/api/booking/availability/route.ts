import { NextResponse } from "next/server";
import { apiError } from "@/lib/booking/api-response";
import { searchCriteriaSchema } from "@/lib/booking/schemas";
import { getPmsProvider } from "@/lib/pms";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const criteria = searchCriteriaSchema.parse(await request.json());
    const offers = await getPmsProvider().searchAvailability(criteria);
    return NextResponse.json({ offers });
  } catch (error) {
    return apiError(error);
  }
}
