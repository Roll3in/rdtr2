# Rada Retreat

Landing page และ booking engine สำหรับโรงแรม สร้างด้วย Next.js, TypeScript และ Tailwind CSS โดยแยกการเชื่อมต่อ PMS ผ่าน provider adapter

## เอกสาร

- [คู่มือสร้างเว็บไซต์เบื้องต้นตั้งแต่เริ่มต้น](docs/website-getting-started.md)
- [คู่มือเพิ่ม PMS Adapter](docs/pms-adapter.md)

## เริ่มต้นใช้งาน

```bash
copy .env.example .env.local
npm install
npm run dev
```

เปิด `http://localhost:3000` แล้วค้นหาห้องจากหน้าแรก ระบบใช้ Mock PMS เป็นค่าเริ่มต้น จึงสามารถเลือกห้อง กรอกข้อมูล และจำลองผลการชำระเงินได้โดยไม่เรียกเก็บเงินจริง

## PMS contract

PMS ทุกตัวต้อง implement `PmsProvider` ใน `src/lib/booking/types.ts` และแปลงข้อมูลเฉพาะของผู้ให้บริการเป็นโมเดลกลางของเว็บไซต์:

- `searchAvailability` — ค้นหาห้องและราคาสุทธิ
- `createReservation` — สร้าง reservation ด้วย idempotency key
- `getReservationStatus` — ตรวจสถานะล่าสุด
- `handleWebhook` — ตรวจและแปลง webhook payload

เพิ่ม adapter ใหม่ใน `src/lib/pms/` แล้ว register ใน `getPmsProvider()`. ห้ามเรียก PMS โดยตรงจาก React component หรือ API route เพื่อให้เปลี่ยนผู้ให้บริการได้โดยไม่กระทบ UI

## Environment variables

| ตัวแปร | การใช้งาน |
| --- | --- |
| `PMS_PROVIDER` | ชื่อ provider ที่ใช้งาน เช่น `mock` |
| `PMS_PROPERTY_ID` | รหัสโรงแรมใน PMS |
| `PMS_BASE_URL` | API base URL ของ PMS |
| `PMS_API_KEY` | credential ฝั่ง server เท่านั้น |
| `PMS_WEBHOOK_KEY` | shared key ใน header `x-pms-webhook-key` |
| `BOOKING_DB_PATH` | ตำแหน่ง SQLite สำหรับข้อมูลอ้างอิงการจอง |

## API ภายใน

- `POST /api/booking/availability`
- `POST /api/booking/reservations` พร้อม header `idempotency-key`
- `GET /api/booking/reservations/:reference`
- `POST /api/pms/webhooks/:provider` พร้อม header `x-pms-webhook-key`

เว็บไซต์เก็บเฉพาะ reference, PMS reservation ID, สถานะ และยอดรวม ไม่เก็บข้อมูลบัตร ข้อมูลผู้เข้าพักถูกส่งผ่านไปยัง PMS ใน request เท่านั้น

## Production checklist

- เขียน adapter ตามเอกสาร sandbox ของ PMS จริงและให้ผ่าน contract tests
- เปลี่ยน repository implementation จาก local SQLite เป็น PostgreSQL เมื่อ deploy แบบหลาย instance
- เชื่อม Email Adapter กับผู้ให้บริการจริง
- ตั้ง secrets ผ่านระบบ environment ของ hosting และไม่ commit `.env.local`
- เพิ่ม rate limiting ที่ edge/API gateway และกำหนด retention policy ก่อนรับข้อมูลลูกค้าจริง
