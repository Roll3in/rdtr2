"use client";

import Link from "next/link";
import { useLanguage } from "./LanguageProvider";

export function Footer() {
  const { tr } = useLanguage();
  return (
    <footer className="footer">
      <div className="footer-image" />
      <div className="footer-content">
        <div><p className="eyebrow light">A QUIET KIND OF LUXURY</p><h2>{tr("ให้ธรรมชาติ", "Let nature")}<br />{tr("โอบกอดคุณ", "embrace you")}</h2></div>
        <div className="footer-links"><span>{tr("สำรวจ", "Explore")}</span><Link href="/#rooms">{tr("ห้องพัก", "Rooms")}</Link><Link href="/#experiences">{tr("ห้องอาหาร", "Dining")}</Link><Link href="/#events">{tr("งานอีเวนต์", "Events")}</Link></div>
        <div className="footer-links"><span>{tr("ติดต่อ", "Contact")}</span><a href="tel:+66000000000">+66 (0) 00 000 0000</a><a href="mailto:stay@radaretreat.com">stay@radaretreat.com</a><p>{tr("เชียงใหม่ ประเทศไทย", "Chiang Mai, Thailand")}</p></div>
      </div>
      <div className="footer-bottom"><span>© 2026 Radateeree Boutique Resort</span><span>Privacy · Terms</span></div>
    </footer>
  );
}
