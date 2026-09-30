"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useLanguage } from "./LanguageProvider";

export function MockPayment() {
  const { tr } = useLanguage();
  const reference = useSearchParams().get("reference") ?? "";
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function complete(outcome: "confirmed" | "failed") {
    setLoading(true);
    await fetch("/api/booking/mock-payment", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ reference, outcome }) });
    router.push(`/booking/confirmation?reference=${reference}`);
  }

  return <main className="mock-payment"><div className="mock-badge">MOCK PMS</div><div className="mock-card"><div className="mock-logo">R</div><p>SECURE PAYMENT SIMULATOR</p><h1>{tr("จำลองหน้าชำระเงินของ PMS", "PMS payment simulator")}</h1><span>{tr("หมายเลขอ้างอิง", "Booking reference")}</span><strong>{reference || tr("ไม่พบข้อมูล", "Not found")}</strong><div className="mock-notice">{tr("หน้านี้ใช้สำหรับทดสอบ integration เท่านั้น", "This page is for integration testing only.")}<br />{tr("ไม่มีการเรียกเก็บเงินจริง", "No real payment will be charged.")}</div><button disabled={loading || !reference} onClick={() => complete("confirmed")}>{tr("จำลองการชำระสำเร็จ", "Simulate successful payment")}</button><button className="mock-fail" disabled={loading || !reference} onClick={() => complete("failed")}>{tr("จำลองการชำระไม่สำเร็จ", "Simulate failed payment")}</button></div></main>;
}
