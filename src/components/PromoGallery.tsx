"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { useLanguage } from "./LanguageProvider";

const images = [
  {
    src: "/pic/Resize/Room/2026_RDTR_Web Stock_Rooms & Suites 1448 x 1086-05.jpg",
    altTh: "ห้องพักพร้อมเตียงสี่เสาและระเบียงสวน",
    altEn: "Four-poster room with a garden balcony",
    className: "promo-a",
  },
  {
    src: "/pic/Resize/Pool/2026_RDTR_Web Stock_Gallery Pool 1448 x 1086-21.jpg",
    altTh: "ห้องพักริมสระว่ายน้ำ",
    altEn: "Poolside guest rooms",
    className: "promo-b",
  },
  {
    src: "/pic/Resize/Baan Rada/2026_RDTR_Web Stock_Dining 1448 x 1086-18.jpg",
    altTh: "อาคารห้องอาหารบ้านรดา",
    altEn: "Baan Rada dining house",
    className: "promo-c",
  },
  {
    src: "/pic/Resize/Event/2026_RDTR_Web Stock_Event 1448 x 1086-10.jpg",
    altTh: "งานแต่งงานในสวนยามค่ำ",
    altEn: "Evening garden wedding",
    className: "promo-d",
  },
  {
    src: "/pic/Resize/Event/2026_RDTR_Web Stock_Event 1448 x 1086-16.jpg",
    altTh: "ห้องจัดเลี้ยงส่วนตัว",
    altEn: "Private celebration room",
    className: "promo-e",
  },
  {
    src: "/pic/Resize/Reception/2026_RDTR_Web Stock_Weddings & Events Reception 1448 x 1086-34.jpg",
    altTh: "สถาปัตยกรรมล้านนาบริเวณหน้า Reception",
    altEn: "Lanna-inspired architecture at the reception",
    className: "promo-f",
  },
];

export function PromoGallery() {
  const sectionRef = useRef<HTMLElement>(null);
  const { language, tr } = useLanguage();

  useEffect(() => {
    if (!sectionRef.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let cleanup = () => {};
    let active = true;

    void (async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      if (!active || !sectionRef.current) return;
      gsap.registerPlugin(ScrollTrigger);
      const context = gsap.context(() => {
        gsap.from(".promo-heading > *", {
          opacity: 0,
          y: 45,
          duration: 0.9,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: { trigger: ".promo-heading", start: "top 82%" },
        });
        gsap.utils.toArray<HTMLElement>(".promo-card").forEach((card, index) => {
          gsap.fromTo(card,
            { opacity: 0, y: index % 2 === 0 ? 90 : 140, scale: 0.94 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 1.15,
              ease: "power3.out",
              scrollTrigger: { trigger: card, start: "top 88%", end: "top 48%", scrub: 0.7 },
            },
          );
          const image = card.querySelector("img");
          if (image) {
            gsap.fromTo(image, { scale: 1.16, yPercent: -4 }, {
              scale: 1.04,
              yPercent: 4,
              ease: "none",
              scrollTrigger: { trigger: card, start: "top bottom", end: "bottom top", scrub: true },
            });
          }
        });
      }, sectionRef);
      cleanup = () => context.revert();
    })();

    return () => { active = false; cleanup(); };
  }, []);

  return (
    <section className="promo-gallery section" ref={sectionRef} aria-labelledby="promo-title">
      <div className="promo-heading">
        <p className="eyebrow">DISCOVER RADA</p>
        <h2 id="promo-title">{tr("มากกว่าการเข้าพัก", "More than a stay")}<br /><em>{tr("คือช่วงเวลาที่เป็นของคุณ", "a moment that is yours")}</em></h2>
        <p>{tr("สำรวจมุมพิเศษของรีสอร์ท ตั้งแต่เช้าที่เงียบสงบ ไปจนถึงค่ำคืนแห่งการเฉลิมฉลอง", "Discover the resort's distinctive spaces, from quiet mornings to evenings made for celebration.")}</p>
      </div>
      <div className="promo-grid">
        {images.map((item) => (
          <figure className={`promo-card ${item.className}`} key={item.src}>
            <Image src={item.src} alt={language === "th" ? item.altTh : item.altEn} fill sizes="(max-width: 700px) 92vw, 48vw" />
          </figure>
        ))}
        <div className="promo-cta">
          <span>RADA TEEREE</span>
          <p>{tr("พักให้ช้าลง แล้วให้ทุกช่วงเวลาเล่าเรื่องของมันเอง", "Slow down and let every moment tell its own story.")}</p>
          <Link href="/booking">{tr("ค้นหาห้องว่าง", "Check availability")} <b>↗</b></Link>
        </div>
      </div>
    </section>
  );
}
