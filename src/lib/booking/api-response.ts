import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { BookingError } from "./errors";

export function apiError(error: unknown) {
  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        error: {
          code: "INVALID_REQUEST",
          message: "กรุณาตรวจสอบข้อมูลอีกครั้ง",
          fields: error.flatten().fieldErrors,
        },
      },
      { status: 400 },
    );
  }
  if (error instanceof BookingError) {
    return NextResponse.json(
      { error: { code: error.code, message: error.message } },
      { status: error.status },
    );
  }
  console.error("Booking API error", error instanceof Error ? error.message : "Unknown error");
  return NextResponse.json(
    { error: { code: "PROVIDER_UNAVAILABLE", message: "ระบบจองไม่พร้อมใช้งานชั่วคราว" } },
    { status: 503 },
  );
}
