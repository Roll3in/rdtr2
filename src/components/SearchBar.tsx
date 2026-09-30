"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useLanguage } from "./LanguageProvider";

function dateAfter(days: number) {
  const value = new Date();
  value.setDate(value.getDate() + days);
  return value.toISOString().slice(0, 10);
}

export function SearchBar() {
  const { tr } = useLanguage();
  const router = useRouter();
  const [checkIn, setCheckIn] = useState(() => dateAfter(1));
  const [checkOut, setCheckOut] = useState(() => dateAfter(2));
  const [adults, setAdults] = useState(2);

  function submit(event: React.FormEvent) {
    event.preventDefault();
    const query = new URLSearchParams({ checkIn, checkOut, adults: String(adults), children: "0", rooms: "1" });
    router.push(`/booking?${query}`);
  }

  return (
    <form className="search-bar" onSubmit={submit}>
      <label><span>{tr("เช็กอิน", "Check-in")}</span><input type="date" value={checkIn} min={dateAfter(0)} onChange={(e) => setCheckIn(e.target.value)} required /></label>
      <label><span>{tr("เช็กเอาต์", "Check-out")}</span><input type="date" value={checkOut} min={checkIn || dateAfter(1)} onChange={(e) => setCheckOut(e.target.value)} required /></label>
      <label><span>{tr("ผู้เข้าพัก", "Guests")}</span><select value={adults} onChange={(e) => setAdults(Number(e.target.value))}>{[1,2,3,4,5,6].map((n) => <option key={n} value={n}>{n} {tr("ท่าน", n === 1 ? "guest" : "guests")}</option>)}</select></label>
      <button type="submit">{tr("ตรวจสอบห้องว่าง", "Check Availability")} <span>→</span></button>
    </form>
  );
}
