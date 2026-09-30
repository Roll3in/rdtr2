import { z } from "zod";

const dateString = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "รูปแบบวันที่ไม่ถูกต้อง");

export const searchCriteriaSchema = z
  .object({
    checkIn: dateString,
    checkOut: dateString,
    adults: z.coerce.number().int().min(1).max(12),
    children: z.coerce.number().int().min(0).max(8),
    rooms: z.coerce.number().int().min(1).max(5),
  })
  .refine((value) => value.checkOut > value.checkIn, {
    message: "วันเช็กเอาต์ต้องอยู่หลังวันเช็กอิน",
    path: ["checkOut"],
  });

export const guestSchema = z.object({
  firstName: z.string().trim().min(1).max(80),
  lastName: z.string().trim().min(1).max(80),
  email: z.email("อีเมลไม่ถูกต้อง"),
  phone: z.string().trim().min(8).max(30),
  country: z.string().trim().min(2).max(80),
  specialRequests: z.string().trim().max(1000).optional(),
});

export const createReservationSchema = z.object({
  offerId: z.string().min(10),
  criteria: searchCriteriaSchema,
  guest: guestSchema,
});

export const mockPaymentSchema = z.object({
  reference: z.string().regex(/^RR-[A-Z0-9]{8}$/),
  outcome: z.enum(["confirmed", "failed"]),
});
