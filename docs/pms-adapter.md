# การเพิ่ม PMS Provider

1. สร้าง adapter ที่ implement `PmsProvider` และเก็บ credential ไว้ฝั่ง server เท่านั้น
2. map room type, rate plan, cancellation policy, taxes และ fees เข้าสู่โมเดลกลาง ห้ามส่ง payload ดิบของ PMS ไปหน้าเว็บ
3. ส่ง idempotency key ไปยัง PMS หากรองรับ หากไม่รองรับให้ตรวจซ้ำจาก repository ก่อนทุกครั้ง
4. คืน `paymentAction: { type: "redirect", url }` เมื่อ PMS เป็นผู้รับชำระเงิน URL ต้องผ่าน allowlist ของ provider
5. ตรวจ webhook shared key ก่อน parse/process payload และใช้ event ID ป้องกัน event ซ้ำ
6. เพิ่ม adapter ใน provider registry และเพิ่ม contract tests สำหรับ availability, sold-out, expired offer, changed price, timeout, create reservation และ webhook mapping

สถานะภายในที่รองรับคือ `pending`, `pending_payment`, `confirmed`, `failed`, `expired` และ `cancelled` หาก PMS มีสถานะอื่น adapter ต้อง map ให้เหลือหนึ่งในสถานะเหล่านี้
