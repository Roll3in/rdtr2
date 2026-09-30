import { Suspense } from "react";
import { MockPayment } from "@/components/MockPayment";

export default function MockPayPage() {
  return <Suspense fallback={<div className="booking-loading">กำลังโหลด…</div>}><MockPayment /></Suspense>;
}
