"use client";

import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import type { GuestDetails, RoomOffer, SearchCriteria } from "@/lib/booking/types";
import { useLanguage } from "./LanguageProvider";

function tomorrow(offset = 1) {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return date.toISOString().slice(0, 10);
}

export function BookingFlow() {
  const { language, tr } = useLanguage();
  const money = useMemo(() => new Intl.NumberFormat(language === "th" ? "th-TH" : "en-US", {
    style: "currency",
    currency: "THB",
    maximumFractionDigits: 0,
  }), [language]);
  const params = useSearchParams();
  const initial = useMemo<SearchCriteria>(() => ({
    checkIn: params.get("checkIn") || tomorrow(1),
    checkOut: params.get("checkOut") || tomorrow(2),
    adults: Number(params.get("adults")) || 2,
    children: Number(params.get("children")) || 0,
    rooms: Number(params.get("rooms")) || 1,
  }), [params]);
  const [criteria, setCriteria] = useState(initial);
  const [offers, setOffers] = useState<RoomOffer[]>([]);
  const [selected, setSelected] = useState<RoomOffer | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);
  const [guest, setGuest] = useState<GuestDetails>({ firstName: "", lastName: "", email: "", phone: "", country: "Thailand", specialRequests: "" });

  async function search(override = criteria) {
    setLoading(true); setError(""); setSelected(null);
    try {
      const response = await fetch("/api/booking/availability", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(override) });
      const data = await response.json();
      if (!response.ok) throw new Error(language === "th" ? (data.error?.message || "ไม่สามารถค้นหาห้องได้") : "Unable to search for available rooms.");
      setOffers(data.offers); setSearched(true);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : tr("เกิดข้อผิดพลาด", "Something went wrong."));
    } finally { setLoading(false); }
  }

  useEffect(() => {
    if (!params.has("checkIn")) return;
    const timer = window.setTimeout(() => void search(initial), 0);
    return () => window.clearTimeout(timer);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function reserve(event: React.FormEvent) {
    event.preventDefault();
    if (!selected) return;
    setLoading(true); setError("");
    try {
      const response = await fetch("/api/booking/reservations", {
        method: "POST",
        headers: { "content-type": "application/json", "idempotency-key": crypto.randomUUID() },
        body: JSON.stringify({ offerId: selected.offerId, criteria, guest }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(language === "th" ? (data.error?.message || "ไม่สามารถสร้างการจองได้") : "Unable to create your reservation.");
      window.location.assign(data.paymentAction?.url || `/booking/confirmation?reference=${data.booking.reference}`);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : tr("เกิดข้อผิดพลาด", "Something went wrong."));
      setLoading(false);
    }
  }

  return (
    <div className="booking-shell">
      <header className="booking-heading"><p className="eyebrow">RESERVATIONS</p><h1>{tr("จองการเข้าพัก", "Book your stay")}</h1><p>{tr("รับราคาที่ดีที่สุดและการยืนยันทันทีผ่านระบบของโรงแรม", "Enjoy our best available rates with instant confirmation.")}</p></header>
      <div className="booking-steps"><span className="active"><b>1</b> {tr("เลือกห้อง", "Choose room")}</span><i /><span className={selected ? "active" : ""}><b>2</b> {tr("ข้อมูลผู้เข้าพัก", "Guest details")}</span><i /><span><b>3</b> {tr("ยืนยัน", "Confirmation")}</span></div>

      {!selected ? <>
        <form className="booking-search" onSubmit={(e) => { e.preventDefault(); void search(); }}>
          <label><span>{tr("เช็กอิน", "Check-in")}</span><input type="date" value={criteria.checkIn} min={tomorrow(0)} onChange={(e) => setCriteria({ ...criteria, checkIn: e.target.value })} required /></label>
          <label><span>{tr("เช็กเอาต์", "Check-out")}</span><input type="date" value={criteria.checkOut} min={criteria.checkIn} onChange={(e) => setCriteria({ ...criteria, checkOut: e.target.value })} required /></label>
          <label><span>{tr("ผู้ใหญ่", "Adults")}</span><select value={criteria.adults} onChange={(e) => setCriteria({ ...criteria, adults: Number(e.target.value) })}>{[1,2,3,4,5,6].map(n => <option key={n}>{n}</option>)}</select></label>
          <label><span>{tr("เด็ก", "Children")}</span><select value={criteria.children} onChange={(e) => setCriteria({ ...criteria, children: Number(e.target.value) })}>{[0,1,2,3,4].map(n => <option key={n}>{n}</option>)}</select></label>
          <label><span>{tr("ห้อง", "Rooms")}</span><select value={criteria.rooms} onChange={(e) => setCriteria({ ...criteria, rooms: Number(e.target.value) })}>{[1,2,3].map(n => <option key={n}>{n}</option>)}</select></label>
          <button disabled={loading}>{loading ? tr("กำลังค้นหา…", "Searching…") : tr("ค้นหาห้อง", "Search rooms")}</button>
        </form>
        {error && <div className="error-banner" role="alert">{error}</div>}
        {searched && <div className="results-heading"><div><p className="eyebrow">AVAILABLE ROOMS</p><h2>{tr("ห้องพักที่พร้อมต้อนรับคุณ", "Rooms ready to welcome you")}</h2></div><p>{criteria.checkIn} — {criteria.checkOut}<br />{criteria.adults + criteria.children} {tr("ผู้เข้าพัก", "guests")} · {criteria.rooms} {tr("ห้อง", "rooms")}</p></div>}
        <div className="offer-list">{offers.map((offer) => <article className="offer-card" key={offer.offerId}>
          <div className="offer-image"><Image src={offer.image} alt={offer.roomName} fill sizes="(max-width: 800px) 100vw, 38vw" /></div>
          <div className="offer-copy"><p>{offer.roomNameEn}</p><h3>{language === "th" ? offer.roomName : offer.roomNameEn}</h3><span>{language === "th" ? offer.description : offer.descriptionEn}</span><div className="offer-meta"><small>{tr("ผู้เข้าพักสูงสุด", "Up to")} {offer.capacity} {tr("ท่าน", "guests")}</small><small>{offer.beds}</small></div><div className="rate"><div><b>{offer.ratePlanName}</b><small>{language === "th" ? offer.cancellationPolicy : offer.cancellationPolicyEn}</small></div><div className="price"><small>{tr("เฉลี่ยต่อคืน", "Average per night")}</small><strong>{money.format(offer.price.nightlyAverage)}</strong><small>{tr("รวมสุทธิ", "Total")} {money.format(offer.price.total)}</small></div></div><button onClick={() => { setSelected(offer); window.scrollTo({ top: 0, behavior: "smooth" }); }}>{tr("เลือกห้องนี้", "Select this room")} <span>→</span></button></div>
        </article>)}</div>
        {searched && offers.length === 0 && <div className="empty-state"><h3>{tr("ไม่พบห้องว่างตามเงื่อนไข", "No rooms match your search")}</h3><p>{tr("ลองเปลี่ยนวันที่หรือจำนวนผู้เข้าพักแล้วค้นหาอีกครั้ง", "Try changing your dates or number of guests.")}</p></div>}
      </> : <form className="guest-layout" onSubmit={reserve}>
        <div className="guest-form"><button type="button" className="back-link" onClick={() => setSelected(null)}>← {tr("กลับไปเลือกห้อง", "Back to rooms")}</button><p className="eyebrow">GUEST DETAILS</p><h2>{tr("ข้อมูลผู้เข้าพัก", "Guest details")}</h2><div className="form-grid">
          <label><span>{tr("ชื่อ", "First name")} *</span><input value={guest.firstName} onChange={(e) => setGuest({ ...guest, firstName: e.target.value })} required /></label>
          <label><span>{tr("นามสกุล", "Last name")} *</span><input value={guest.lastName} onChange={(e) => setGuest({ ...guest, lastName: e.target.value })} required /></label>
          <label><span>{tr("อีเมล", "Email")} *</span><input type="email" value={guest.email} onChange={(e) => setGuest({ ...guest, email: e.target.value })} required /></label>
          <label><span>{tr("เบอร์โทรศัพท์", "Phone number")} *</span><input type="tel" value={guest.phone} onChange={(e) => setGuest({ ...guest, phone: e.target.value })} required /></label>
          <label className="full"><span>{tr("ประเทศ", "Country")} *</span><input value={guest.country} onChange={(e) => setGuest({ ...guest, country: e.target.value })} required /></label>
          <label className="full"><span>{tr("คำขอพิเศษ", "Special requests")}</span><textarea value={guest.specialRequests} onChange={(e) => setGuest({ ...guest, specialRequests: e.target.value })} rows={4} /></label>
        </div>{error && <div className="error-banner" role="alert">{error}</div>}<p className="privacy-note">{tr("ข้อมูลของคุณจะถูกส่งอย่างปลอดภัยไปยังระบบจัดการโรงแรม และจะไม่เก็บข้อมูลบัตรบนเว็บไซต์นี้", "Your details are securely sent to the hotel management system. Card information is never stored on this website.")}</p></div>
        <aside className="booking-summary"><div className="summary-image"><Image src={selected.image} alt={selected.roomNameEn} fill sizes="380px" /></div><p>{selected.roomNameEn}</p><h3>{language === "th" ? selected.roomName : selected.roomNameEn}</h3><div className="stay-detail"><span>{tr("เข้าพัก", "Check-in")} <b>{criteria.checkIn}</b></span><span>{tr("ออก", "Check-out")} <b>{criteria.checkOut}</b></span><span>{tr("ผู้เข้าพัก", "Guests")} <b>{criteria.adults + criteria.children} {tr("ท่าน", "guests")}</b></span><span>{tr("ห้อง", "Rooms")} <b>{criteria.rooms} {tr("ห้อง", "rooms")}</b></span></div><div className="price-lines"><span>{tr("ราคาห้อง", "Room subtotal")} <b>{money.format(selected.price.subtotal)}</b></span><span>{tr("ภาษี", "Taxes")} <b>{money.format(selected.price.taxes)}</b></span><span>{tr("ค่าบริการ", "Service fees")} <b>{money.format(selected.price.fees)}</b></span><strong>{tr("ยอดรวม", "Total")} <b>{money.format(selected.price.total)}</b></strong></div><button type="submit" disabled={loading}>{loading ? tr("กำลังสร้างการจอง…", "Creating reservation…") : tr("ยืนยันและชำระเงิน →", "Confirm & pay →")}</button><small>{tr("คุณจะถูกส่งไปยังหน้าชำระเงินที่ปลอดภัยของ PMS", "You will continue to the PMS secure payment page.")}</small></aside>
      </form>}
    </div>
  );
}
