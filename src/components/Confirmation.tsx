"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import type { BookingRecord } from "@/lib/booking/types";
import { useLanguage } from "./LanguageProvider";

export function Confirmation() {
  const { tr } = useLanguage();
  const reference = useSearchParams().get("reference") ?? "";
  const [booking, setBooking] = useState<BookingRecord | null>(null);
  const [error, setError] = useState("");
  useEffect(() => { if (!reference) return; fetch(`/api/booking/reservations/${reference}`).then(async (response) => { const data = await response.json(); if (!response.ok) throw new Error(data.error?.message); setBooking(data.booking); }).catch((cause) => setError(cause.message)); }, [reference]);
  if (error || !reference) return <div className="confirmation"><div className="status-icon failed">!</div><h1>{tr("ไม่พบการจอง", "Reservation not found")}</h1><p>{error || tr("ลิงก์ยืนยันไม่สมบูรณ์", "The confirmation link is incomplete.")}</p><Link href="/booking" className="button-dark">{tr("กลับไปหน้าจอง", "Return to booking")}</Link></div>;
  if (!booking) return <div className="booking-loading">{tr("กำลังตรวจสอบสถานะกับ PMS…", "Checking your reservation with the PMS…")}</div>;
  const success = booking.status === "confirmed";
  return <div className="confirmation"><div className={`status-icon ${success ? "" : "failed"}`}>{success ? "✓" : "!"}</div><p className="eyebrow">{success ? "RESERVATION CONFIRMED" : "PAYMENT STATUS"}</p><h1>{success ? tr("การจองสำเร็จ", "Reservation confirmed") : tr("การชำระเงินยังไม่สำเร็จ", "Payment not completed")}</h1><p>{success ? tr("ขอบคุณที่เลือกพักกับ Rada Retreat รายละเอียดการยืนยันจะถูกส่งไปยังอีเมลของคุณ", "Thank you for choosing Rada Retreat. Your confirmation details will be sent to your email.") : tr("ยังไม่มีการยืนยันจากระบบชำระเงิน กรุณาลองทำรายการใหม่หรือติดต่อโรงแรม", "Payment has not been confirmed. Please try again or contact the hotel.")}</p><div className="reference-box"><span>{tr("หมายเลขการจอง", "Booking reference")}</span><strong>{booking.reference}</strong><small>PMS Reference: {booking.providerReservationId}</small></div><div className="confirmation-actions">{!success && <Link href="/booking" className="button-dark">{tr("ลองจองอีกครั้ง", "Try again")}</Link>}<Link href="/" className="text-link">{tr("กลับหน้าแรก", "Back to home")} →</Link></div></div>;
}
