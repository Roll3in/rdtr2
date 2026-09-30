"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useLanguage } from "./LanguageProvider";

export function Header({ solid = false }: { solid?: boolean }) {
  const { language, setLanguage, tr } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 50);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <header className={`site-header ${solid || scrolled ? "header-solid" : ""}`}>
      <Link className="brand" href="/" aria-label="Rada Retreat หน้าแรก">
        <Image
          className="brand-logo"
          src="/pic/logo.png"
          alt="รดาธีรี บูติค รีสอร์ท"
          width={296}
          height={308}
          priority
        />
      </Link>
      <button className="menu-toggle" onClick={() => setOpen(!open)} aria-expanded={open} aria-label="เปิดเมนู">
        <span /><span />
      </button>
      <nav className={open ? "nav-open" : ""} aria-label={tr("เมนูหลัก", "Main navigation")}>
        <Link href="/#story" onClick={() => setOpen(false)}>{tr("เรื่องราว", "Our Story")}</Link>
        <Link href="/#rooms" onClick={() => setOpen(false)}>{tr("ห้องพัก", "Rooms")}</Link>
        <Link href="/#experiences" onClick={() => setOpen(false)}>{tr("ประสบการณ์", "Experiences")}</Link>
        <Link href="/#events" onClick={() => setOpen(false)}>{tr("งานอีเวนต์", "Events")}</Link>
        <div className="language-toggle" role="group" aria-label="Language">
          <button className={language === "th" ? "active" : ""} onClick={() => setLanguage("th")} type="button">TH</button>
          <span>/</span>
          <button className={language === "en" ? "active" : ""} onClick={() => setLanguage("en")} type="button">EN</button>
        </div>
        <Link className="nav-book" href="/booking" onClick={() => setOpen(false)}>{tr("จองห้องพัก", "Book Now")}</Link>
      </nav>
    </header>
  );
}
