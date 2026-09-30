# คู่มือสร้างเว็บไซต์โรงแรมเบื้องต้นตั้งแต่เริ่มต้น

คู่มือนี้อ้างอิงจากโปรเจกต์ Radateeree Boutique Resort ซึ่งสร้างด้วย Next.js, TypeScript และ Tailwind CSS พร้อมระบบสองภาษา, Booking Engine, PMS Adapter และ animation ด้วย GSAP/React Bits

## 1. สิ่งที่ต้องติดตั้ง

ติดตั้งเครื่องมือพื้นฐานก่อนเริ่มงาน:

- Node.js เวอร์ชัน 20 ขึ้นไป
- npm ซึ่งติดตั้งมาพร้อม Node.js
- Visual Studio Code หรือโปรแกรมแก้ไขโค้ดอื่น
- Git สำหรับจัดเก็บประวัติการแก้ไข

ตรวจสอบเวอร์ชัน:

```bash
node --version
npm --version
git --version
```

บน Windows หาก PowerShell ไม่อนุญาตให้เรียก `npm.ps1` ให้ใช้ `npm.cmd` แทน เช่น `npm.cmd install`

## 2. สร้างโปรเจกต์ Next.js

สร้างโปรเจกต์ใหม่ด้วย App Router และ TypeScript:

```bash
npx create-next-app@latest hotel-website
cd hotel-website
```

ตัวเลือกที่แนะนำ:

- TypeScript: Yes
- ESLint: Yes
- Tailwind CSS: Yes
- App Router: Yes
- Import alias: `@/*`

สำหรับโปรเจกต์นี้ที่สร้างไว้แล้ว ให้ติดตั้ง dependency ด้วย:

```bash
npm install
```

เปิด development server:

```bash
npm run dev
```

จากนั้นเปิด `http://localhost:3000`

## 3. โครงสร้างไฟล์สำคัญ

```text
hotel-website/
├─ public/
│  └─ pic/                       รูปภาพและโลโก้
├─ src/
│  ├─ app/
│  │  ├─ api/                    API routes
│  │  ├─ booking/                หน้าจองและหน้ายืนยัน
│  │  ├─ globals.css             สไตล์รวม
│  │  ├─ layout.tsx              Layout และ metadata
│  │  └─ page.tsx                Landing Page
│  ├─ components/                UI components
│  └─ lib/
│     ├─ booking/                Type, validation และ repository
│     ├─ email/                  Email Adapter
│     └─ pms/                    PMS Provider Adapter
├─ docs/                         เอกสารโปรเจกต์
├─ .env.example                  ตัวอย่าง environment variables
└─ package.json
```

แยก UI, business logic และ external integration ออกจากกันตั้งแต่ต้น จะช่วยให้เปลี่ยนดีไซน์หรือ PMS โดยไม่กระทบส่วนอื่น

## 4. เตรียมรูปภาพ

นำรูปที่ต้องการใช้งานไว้ใน `public/pic` และตั้งชื่อสั้น อ่านง่าย ไม่มีข้อมูลลับ เช่น:

```text
public/pic/logo.png
public/pic/hero.jpg
public/pic/room-deluxe.jpg
public/pic/pool.jpg
```

เรียกรูปผ่าน path ที่เริ่มด้วย `/pic/`:

```tsx
import Image from "next/image";

<Image
  src="/pic/hero.jpg"
  alt="อาคารโรงแรมท่ามกลางสวน"
  fill
  priority
  sizes="100vw"
/>
```

แนวทางเลือกรูป:

- Hero ควรเป็นภาพแนวนอนที่มีพื้นที่ว่างสำหรับวางข้อความ
- ไม่ใช้ภาพมุมเดียวกันซ้ำหลายส่วน
- ใส่ `alt` ที่อธิบายภาพจริง
- ใช้ `priority` เฉพาะภาพแรกที่อยู่เหนือ fold
- รูปอื่นให้ Next.js lazy-load ตามค่าเริ่มต้น
- ลดขนาดไฟล์ก่อนนำขึ้น production

## 5. วางโครง Landing Page

Landing Page โรงแรมทั่วไปควรมีส่วนสำคัญดังนี้:

1. Header และปุ่มจองห้องพัก
2. Hero พร้อมภาพหลักและช่องค้นหาห้อง
3. เรื่องราวและจุดเด่นของโรงแรม
4. ห้องพักและห้องสวีต
5. ห้องอาหาร สระว่ายน้ำ และสิ่งอำนวยความสะดวก
6. งานแต่งงาน ห้องประชุม หรืองานอีเวนต์
7. Promotional Gallery
8. Call to Action และ Footer

กำหนดสีหลักเป็น CSS variables เพื่อแก้ธีมได้จากที่เดียว:

```css
:root {
  --ink: #17362f;
  --forest: #153f35;
  --cream: #f5f1e8;
  --paper: #fcfaf5;
  --gold: #b7935d;
}
```

## 6. ใช้ฟอนต์ Prompt

ติดตั้งฟอนต์แบบ self-hosted:

```bash
npm install @fontsource/prompt
```

Import น้ำหนักที่ใช้งานใน `src/app/layout.tsx`:

```tsx
import "@fontsource/prompt/300.css";
import "@fontsource/prompt/400.css";
import "@fontsource/prompt/500.css";
import "@fontsource/prompt/600.css";
```

กำหนดใน CSS:

```css
:root {
  --font-display: "Prompt", sans-serif;
  --font-body: "Prompt", sans-serif;
}

body {
  font-family: var(--font-body);
}
```

การ self-host ช่วยให้เว็บไซต์ไม่ต้องเชื่อม Google Fonts ขณะ build หรือเปิดหน้าเว็บ

## 7. ทำ Responsive Design

ออกแบบ desktop ก่อน แล้วเพิ่ม breakpoint สำหรับแท็บเล็ตและมือถือ:

```css
@media (max-width: 900px) {
  /* เปลี่ยนเมนูเป็น mobile menu และลดจำนวนคอลัมน์ */
}

@media (max-width: 600px) {
  /* จัดทุกส่วนเป็นคอลัมน์เดียวและลดระยะห่าง */
}
```

สิ่งที่ต้องตรวจทุก breakpoint:

- Header และโลโก้ไม่ชนเมนู
- Heading ไม่ล้นหน้าจอ
- ช่องค้นหาและฟอร์มกดใช้งานได้
- ปุ่มมีพื้นที่สัมผัสเพียงพอบนมือถือ
- รูปไม่บิดหรือถูก crop ส่วนสำคัญ
- ไม่มีข้อความซ้อนกัน

## 8. เพิ่มระบบภาษาไทยและอังกฤษ

สร้าง `LanguageProvider` เพื่อเก็บภาษาปัจจุบันและ helper สำหรับเลือกข้อความ:

```tsx
const { language, setLanguage, tr } = useLanguage();

<button onClick={() => setLanguage("th")}>TH</button>
<button onClick={() => setLanguage("en")}>EN</button>

<h2>{tr("ห้องพัก", "Rooms")}</h2>
```

แนวทางที่ควรมี:

- ค่าเริ่มต้นเป็นภาษาไทย
- บันทึกภาษาลง `localStorage`
- เปลี่ยน `<html lang>` เป็น `th` หรือ `en`
- แปลทั้ง navigation, form labels, error message และ confirmation
- PMS Adapter ควรคืนชื่อและคำอธิบายห้องทั้งสองภาษา

สำหรับเว็บไซต์ขนาดใหญ่หรือเน้น SEO หลายภาษา ควรพัฒนาเป็น route `/th` และ `/en` ในระยะถัดไป

## 9. เพิ่ม Animation อย่างพอดี

ติดตั้ง GSAP และ Motion:

```bash
npm install gsap motion
```

โปรเจกต์นี้ใช้:

- GSAP + ScrollTrigger สำหรับ Promotional Gallery
- Motion สำหรับ Blur Text ที่ Hero
- CSS transition สำหรับ hover และ navigation

หลักการใช้งาน:

- Animation ต้องช่วยนำสายตา ไม่แย่งความสนใจจากรูปโรงแรม
- หลีกเลี่ยง animation บน input และขั้นตอนสำคัญของการจอง
- ใช้ transform และ opacity เป็นหลักเพื่อประสิทธิภาพที่ดี
- cleanup GSAP context เมื่อ component unmount
- รองรับผู้ใช้ที่ปิด motion:

```ts
if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  return;
}
```

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation: none !important;
    transition: none !important;
    scroll-behavior: auto !important;
  }
}
```

## 10. สร้าง Booking Flow

Booking Flow ขั้นพื้นฐานประกอบด้วย:

1. เลือกวันเช็กอินและเช็กเอาต์
2. ระบุจำนวนผู้ใหญ่ เด็ก และห้อง
3. ค้นหา availability จาก PMS
4. แสดง room offer และราคาสุทธิ
5. เลือกห้องและกรอกข้อมูลผู้เข้าพัก
6. สร้าง reservation
7. ส่งผู้ใช้ไปชำระเงินกับ PMS
8. รับผู้ใช้กลับมาที่ confirmation page

อย่าให้ React component เรียก PMS โดยตรง ควรเรียก API ภายในของเว็บไซต์:

```text
Browser → Next.js API → Booking Service → PMS Adapter → PMS
```

API ภายในของโปรเจกต์:

```text
POST /api/booking/availability
POST /api/booking/reservations
GET  /api/booking/reservations/:reference
POST /api/pms/webhooks/:provider
```

## 11. เตรียมเชื่อม PMS

กำหนด interface กลางเพื่อให้ UI ไม่ผูกกับ PMS รายใดรายหนึ่ง:

```ts
interface PmsProvider {
  searchAvailability(criteria: SearchCriteria): Promise<RoomOffer[]>;
  createReservation(
    request: CreateReservationRequest,
    idempotencyKey: string,
  ): Promise<ReservationResult>;
  getReservationStatus(id: string): Promise<BookingStatus>;
  handleWebhook(payload: unknown): Promise<PmsWebhookEvent>;
}
```

PMS Adapter มีหน้าที่:

- ใส่ authentication ตามข้อกำหนดของ PMS
- แปลง room code และ rate plan
- แปลงราคา ภาษี ค่าธรรมเนียม และ cancellation policy
- แปลงสถานะของ PMS เป็นสถานะกลางของเว็บไซต์
- คืน payment URL หาก PMS เป็นผู้รับชำระเงิน
- ตรวจและแปลง webhook payload

ดูรายละเอียดเพิ่มเติมที่ `docs/pms-adapter.md`

## 12. Environment Variables

คัดลอกไฟล์ตัวอย่าง:

```bash
copy .env.example .env.local
```

ค่าหลัก:

```env
PMS_PROVIDER=mock
PMS_PROPERTY_ID=radateeree-boutique-resort
PMS_BASE_URL=
PMS_API_KEY=
PMS_WEBHOOK_KEY=change-me
BOOKING_DB_PATH=./data/bookings.db
```

ข้อควรระวัง:

- ห้าม commit `.env.local`
- ห้ามส่ง PMS secret ไป browser
- ห้ามใส่ secret ในตัวแปรที่ขึ้นต้นด้วย `NEXT_PUBLIC_`
- แยก credentials ระหว่าง development, staging และ production

## 13. Validation และความปลอดภัย

ใช้ Zod ตรวจข้อมูลทุก API request:

```ts
const input = createReservationSchema.parse(await request.json());
```

ระบบจองควรมี:

- ตรวจรูปแบบวันที่และลำดับ check-in/check-out
- จำกัดจำนวนผู้เข้าพักและจำนวนห้อง
- ตรวจรูปแบบอีเมลและความยาวข้อความ
- ใช้ idempotency key ป้องกันการจองซ้ำ
- ตรวจ webhook key/signature
- บันทึก webhook event ID ป้องกัน event ซ้ำ
- ไม่เก็บข้อมูลบัตร
- ไม่บันทึกข้อมูลส่วนบุคคลลง log
- เพิ่ม rate limiting ก่อนเปิด production

## 14. ทดสอบเว็บไซต์

รันคำสั่งพื้นฐานก่อนส่งงานทุกครั้ง:

```bash
npm run lint
npm test
npm run build
```

ตรวจผ่านเบราว์เซอร์เพิ่มเติม:

- Landing Page ที่ความกว้าง 390, 768, 1024 และ 1440 พิกเซล
- ภาษาไทยและอังกฤษ
- Mobile menu
- ค้นหาห้องและแสดงราคา
- กรอกแบบฟอร์มครบและไม่ครบ
- Payment success/failure
- Confirmation page
- PMS timeout และห้องเต็ม
- Keyboard navigation และ focus states
- `prefers-reduced-motion`
- Console ต้องไม่มี application error

## 15. เตรียม Production

ก่อน deploy จริง:

1. เปลี่ยน Mock PMS เป็น adapter ของ PMS จริง
2. ใช้ sandbox ของ PMS ทดสอบครบทุกสถานะ
3. เปลี่ยน SQLite เป็น PostgreSQL หาก deploy หลาย instance
4. เชื่อม Email Adapter กับบริการส่งอีเมล
5. เปลี่ยนข้อมูลติดต่อ placeholder เป็นข้อมูลจริง
6. เพิ่ม Privacy Policy, Terms และ Consent ที่จำเป็น
7. ตั้ง rate limiting, monitoring และ error tracking
8. กำหนด retention policy สำหรับข้อมูลลูกค้า
9. ตรวจ SEO metadata, Open Graph และ sitemap
10. ทดสอบ performance และ accessibility

## 16. คำสั่งที่ใช้บ่อย

```bash
# ติดตั้ง dependency
npm install

# เปิด development server
npm run dev

# ตรวจโค้ด
npm run lint

# รัน tests
npm test

# สร้าง production build
npm run build

# เปิด production server หลัง build
npm start
```

## 17. ปัญหาที่พบบ่อย

### รูปภาพไม่แสดง

- ตรวจว่าไฟล์อยู่ใน `public/pic`
- path ต้องเริ่มด้วย `/pic/`
- ตรวจตัวพิมพ์ใหญ่และเล็กของชื่อไฟล์
- หลีกเลี่ยงการเปลี่ยนชื่อไฟล์โดยไม่แก้ path ในโค้ด

### Build โหลด Google Fonts ไม่ได้

ใช้ `@fontsource/prompt` แบบ self-hosted แทน `next/font/google`

### PowerShell ไม่อนุญาตให้เรียก npm

ใช้ `npm.cmd` เช่น:

```powershell
npm.cmd run dev
```

### Animation ทำให้ข้อความมองไม่เห็น

- ตรวจ initial และ animate state
- ตรวจว่า JavaScript โหลดสำเร็จ
- เพิ่ม fallback เมื่อ reduced motion
- อย่าซ่อนเนื้อหาหลักด้วย opacity หากไม่มี client-side animation

### การจองถูกสร้างซ้ำ

- ส่ง idempotency key ทุกครั้งที่สร้าง reservation
- ปิดปุ่มระหว่างกำลังส่งข้อมูล
- ตรวจรายการเดิมใน repository ก่อนเรียก PMS

## Checklist สรุป

- [ ] เว็บไซต์ responsive และไม่มีข้อความทับซ้อน
- [ ] รูปมี alt text และขนาดเหมาะสม
- [ ] ภาษาไทยและอังกฤษครบทุกขั้นตอน
- [ ] Booking API ผ่าน validation
- [ ] ป้องกัน reservation และ webhook ซ้ำ
- [ ] ไม่มี secret ใน client bundle
- [ ] รองรับ reduced motion
- [ ] Lint, tests และ production build ผ่าน
- [ ] ทดสอบ PMS sandbox ก่อนใช้งานจริง
- [ ] มี Privacy Policy และข้อมูลติดต่อจริง
