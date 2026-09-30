import { Suspense } from "react";
import { Header } from "@/components/Header";
import { Confirmation } from "@/components/Confirmation";

export default function ConfirmationPage() {
  return <main className="booking-page"><Header solid /><Suspense fallback={<div className="booking-loading">กำลังตรวจสอบการจอง…</div>}><Confirmation /></Suspense></main>;
}
