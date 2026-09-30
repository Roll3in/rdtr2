import type { Metadata } from "next";
import { Suspense } from "react";
import { Header } from "@/components/Header";
import { BookingFlow } from "@/components/BookingFlow";

export const metadata: Metadata = { title: "จองห้องพัก" };

export default function BookingPage() {
  return (
    <main className="booking-page">
      <Header solid />
      <Suspense fallback={<div className="booking-loading">กำลังเตรียมระบบจอง…</div>}><BookingFlow /></Suspense>
    </main>
  );
}
