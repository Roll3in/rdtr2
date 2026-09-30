"use client";

import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/Header";
import { SearchBar } from "@/components/SearchBar";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/components/LanguageProvider";
import { PromoGallery } from "@/components/PromoGallery";
import { BlurTextHeading } from "@/components/BlurTextHeading";

export default function Home() {
  const { tr } = useLanguage();
  const experiences = [
    { image: "/pic/dining.jpg", title: tr("บ้านรดา", "Baan Rada"), en: "Baan Rada Dining", text: tr("รสชาติท้องถิ่นที่ตีความใหม่ด้วยวัตถุดิบตามฤดูกาล", "Seasonal local flavours, thoughtfully reimagined.") },
    { image: "/pic/pool.jpg", title: tr("พักกายริมสระ", "Slow Pool Days"), en: "Slow Pool Days", text: tr("ปล่อยเวลาให้เดินช้าลงในมุมสงบกลางสวนเขียว", "Let time slow down in a peaceful corner of the garden.") },
    { image: "/pic/garden.jpg", title: tr("สวนแห่งความสุข", "The Garden"), en: "The Garden", text: tr("พื้นที่กว้างสำหรับทุกคนในครอบครัวและช่วงเวลาที่เรียบง่าย", "Open green space for family and life's simplest moments.") },
  ];
  return (
    <main>
      <Header />
      <section className="hero">
        <Image src="/pic/hero.jpg" alt="อาคาร Radateeree Boutique Resort ท่ามกลางสวนในยามเย็น" fill priority sizes="100vw" />
        <div className="hero-shade" />
        <div className="hero-copy">
          <p>CHIANG MAI · THAILAND</p>
          <BlurTextHeading text="Where stillness feels like home." emphasizeFrom={2} />
          <span>{tr("พื้นที่พักใจที่ความงามของล้านนาและธรรมชาติมาพบกัน", "A serene retreat where Lanna beauty meets nature.")}</span>
        </div>
        <div className="hero-search"><SearchBar /></div>
        <a href="#story" className="scroll-cue">{tr("เลื่อนเพื่อสำรวจ", "Scroll to explore")} <b>↓</b></a>
      </section>

      <section className="intro section" id="story">
        <div className="intro-heading"><p className="eyebrow">OUR STORY</p><h2>{tr("ความเรียบง่าย", "Simplicity,")}<br />{tr("ที่ออกแบบมาอย่างตั้งใจ", "thoughtfully designed")}</h2></div>
        <div className="intro-copy"><p>{tr("เราเชื่อว่าการพักผ่อนที่ดีที่สุด เริ่มต้นจากพื้นที่ที่ทำให้คุณรู้สึกเป็นตัวเอง Radateeree Boutique Resort จึงถ่ายทอดเสน่ห์ของเรือนไทยล้านนาผ่านงานไม้ แสงอุ่น และสวนที่เติบโตไปพร้อมกับกาลเวลา", "We believe the finest rest begins in a place where you can truly be yourself. Radateeree Boutique Resort captures the spirit of Lanna through natural wood, warm light and gardens that grow with time.")}</p><p>{tr("ทุกห้อง ทุกมื้ออาหาร และทุกรายละเอียด ถูกสร้างขึ้นเพื่อให้คุณได้หยุดพักอย่างแท้จริง", "Every room, every meal and every detail is created so you can genuinely slow down.")}</p><Link href="/booking" className="text-link">{tr("วางแผนการเข้าพัก", "Plan your stay")} <span>↗</span></Link></div>
      </section>

      <section className="rooms section" id="rooms">
        <div className="section-title"><div><p className="eyebrow">ROOMS & SUITES</p><h2>{tr("พื้นที่ส่วนตัว", "Your private space")}<br />{tr("เพื่อการพักผ่อน", "to truly unwind")}</h2></div><p>{tr("แสงธรรมชาติ เนื้อไม้ และสัมผัสอ่อนโยนของผืนผ้า—ทุกองค์ประกอบพาคุณกลับสู่ความสงบ", "Natural light, warm wood and soft textiles—every element brings you back to a sense of calm.")}</p></div>
        <div className="room-showcase">
          <article className="room-card room-card-large"><Image src="/pic/room-deluxe.jpg" alt="Garden Deluxe" fill sizes="(max-width: 800px) 100vw, 65vw" /><div><span>01</span><p>Garden Deluxe</p><h3>{tr("ห้องการ์เดนดีลักซ์", "Garden Deluxe")}</h3><Link href="/booking">{tr("ค้นหาห้องว่าง", "Check availability")} →</Link></div></article>
          <article className="room-card"><Image src="/pic/pool-villa.jpg" alt="Private Pool Villa" fill sizes="(max-width: 800px) 100vw, 35vw" /><div><span>02</span><p>Private Pool Villa</p><h3>{tr("พูลวิลล่าส่วนตัว", "Private Pool Villa")}</h3><Link href="/booking">{tr("ค้นหาห้องว่าง", "Check availability")} →</Link></div></article>
        </div>
      </section>

      <section className="experiences section" id="experiences">
        <div className="center-title"><p className="eyebrow">EXPERIENCES</p><h2>{tr("วันธรรมดา ที่น่าจดจำ", "Everyday moments, remembered")}</h2><p>{tr("เติมเต็มการเข้าพักด้วยรสชาติ ความสดชื่น และพื้นที่สีเขียว", "Complete your stay with inspired flavours, refreshing moments and green spaces.")}</p></div>
        <div className="experience-grid">{experiences.map((item, index) => <article key={item.en} className={index === 1 ? "experience-raised" : ""}><div className="experience-image"><Image src={item.image} alt={item.title} fill sizes="(max-width: 800px) 100vw, 33vw" /></div><span>0{index + 1} / 03</span><p>{item.en}</p><h3>{item.title}</h3><small>{item.text}</small></article>)}</div>
      </section>

      <PromoGallery />

      <section className="event-section" id="events">
        <div className="event-image"><Image src="/pic/event.jpg" alt="การจัดงานแต่งงานในสวน" fill sizes="(max-width: 900px) 100vw, 56vw" /></div>
        <div className="event-copy"><p className="eyebrow light">WEDDINGS & GATHERINGS</p><h2>{tr("ช่วงเวลาสำคัญ", "Meaningful moments")}<br /><em>{tr("ในแบบของคุณ", "made uniquely yours")}</em></h2><p>{tr("ตั้งแต่งานแต่งงานในสวน ไปจนถึงการประชุมขนาดเล็ก เราดูแลทุกองค์ประกอบให้เรื่องราวของคุณงดงามและเป็นธรรมชาติ", "From garden weddings to intimate meetings, we shape every detail so your story unfolds beautifully and naturally.")}</p><a href="mailto:events@radaretreat.com" className="button-light">{tr("เริ่มวางแผนงาน", "Plan your event")} <span>→</span></a></div>
      </section>

      <section className="closing section"><p className="eyebrow">STAY A LITTLE LONGER</p><h2>{tr("ความสุข อาจเป็นเพียง", "Happiness may simply be")}<br />{tr("การได้อยู่กับปัจจุบัน", "being present")}</h2><Link href="/booking" className="button-dark">{tr("จองการเข้าพัก", "Book your stay")} <span>→</span></Link></section>
      <Footer />
    </main>
  );
}
