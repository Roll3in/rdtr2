import { randomUUID } from "node:crypto";
import { BookingError } from "@/lib/booking/errors";
import type {
  BookingStatus,
  CreateReservationRequest,
  PmsProvider,
  PriceBreakdown,
  ReservationResult,
  RoomOffer,
  SearchCriteria,
} from "@/lib/booking/types";

type OfferToken = {
  roomCode: string;
  criteria: SearchCriteria;
  expiresAt: string;
  price: PriceBreakdown;
};

const rooms = [
  {
    code: "garden-deluxe",
    name: "ห้องการ์เดนดีลักซ์",
    nameEn: "Garden Deluxe",
    description: "ห้องพักโทนอบอุ่นที่เปิดรับแสงธรรมชาติและวิวสวนส่วนตัว",
    descriptionEn: "A warm, light-filled room opening onto a private garden view.",
    image: "/pic/room-deluxe.jpg",
    capacity: 2,
    beds: "1 เตียงคิงไซส์",
    base: 4200,
  },
  {
    code: "pool-villa",
    name: "พูลวิลล่าส่วนตัว",
    nameEn: "Private Pool Villa",
    description: "พื้นที่พักผ่อนเป็นส่วนตัว พร้อมสระขนาดกะทัดรัดท่ามกลางสวน",
    descriptionEn: "A private hideaway with an intimate pool surrounded by greenery.",
    image: "/pic/pool-villa.jpg",
    capacity: 3,
    beds: "1 เตียงคิงไซส์ + Daybed",
    base: 6800,
  },
  {
    code: "rada-suite",
    name: "รดาสวีต",
    nameEn: "Rada Suite",
    description: "ห้องสวีตกว้างขวางสำหรับการพักผ่อนที่เงียบสงบและเป็นส่วนตัว",
    descriptionEn: "A spacious suite designed for quiet and deeply private relaxation.",
    image: "/pic/room-suite.jpg",
    capacity: 4,
    beds: "1 เตียงคิงไซส์ + Living room",
    base: 7900,
  },
] as const;

function nights(criteria: SearchCriteria) {
  return Math.max(
    1,
    Math.round(
      (Date.parse(`${criteria.checkOut}T00:00:00Z`) -
        Date.parse(`${criteria.checkIn}T00:00:00Z`)) /
        86_400_000,
    ),
  );
}

function encodeOffer(token: OfferToken) {
  return Buffer.from(JSON.stringify(token)).toString("base64url");
}

function decodeOffer(value: string): OfferToken {
  try {
    return JSON.parse(Buffer.from(value, "base64url").toString("utf8")) as OfferToken;
  } catch {
    throw new BookingError("INVALID_REQUEST", "ไม่พบข้อเสนอราคานี้");
  }
}

export class MockPmsProvider implements PmsProvider {
  readonly name = "mock";

  async searchAvailability(criteria: SearchCriteria): Promise<RoomOffer[]> {
    const stayNights = nights(criteria);
    const expiresAt = new Date(Date.now() + 15 * 60_000).toISOString();

    return rooms
      .filter((room) => room.capacity * criteria.rooms >= criteria.adults + criteria.children)
      .map((room) => {
        const subtotal = room.base * stayNights * criteria.rooms;
        const taxes = Math.round(subtotal * 0.07);
        const fees = Math.round(subtotal * 0.1);
        const price: PriceBreakdown = {
          nightlyAverage: room.base,
          subtotal,
          taxes,
          fees,
          total: subtotal + taxes + fees,
          currency: "THB",
        };
        return {
          offerId: encodeOffer({ roomCode: room.code, criteria, expiresAt, price }),
          roomCode: room.code,
          roomName: room.name,
          roomNameEn: room.nameEn,
          description: room.description,
          descriptionEn: room.descriptionEn,
          image: room.image,
          capacity: room.capacity,
          beds: room.beds,
          ratePlanCode: "best-flexible",
          ratePlanName: "Best Flexible Rate",
          cancellationPolicy: "ยกเลิกฟรีล่วงหน้า 3 วันก่อนวันเข้าพัก",
          cancellationPolicyEn: "Free cancellation up to 3 days before arrival",
          expiresAt,
          price,
        };
      });
  }

  async createReservation(request: CreateReservationRequest, _idempotencyKey: string): Promise<ReservationResult> {
    void _idempotencyKey;
    const offer = decodeOffer(request.offerId);
    if (Date.parse(offer.expiresAt) < Date.now()) {
      throw new BookingError("OFFER_EXPIRED", "ราคานี้หมดอายุแล้ว กรุณาค้นหาใหม่");
    }
    if (JSON.stringify(offer.criteria) !== JSON.stringify(request.criteria)) {
      throw new BookingError("INVALID_REQUEST", "รายละเอียดการเข้าพักไม่ตรงกับข้อเสนอ");
    }
    return {
      providerReservationId: `MOCK-${randomUUID().slice(0, 8).toUpperCase()}`,
      status: "pending_payment",
      price: offer.price,
    };
  }

  async getReservationStatus(): Promise<BookingStatus> {
    return "pending_payment";
  }

  async handleWebhook(payload: unknown) {
    const event = payload as Record<string, unknown>;
    if (
      typeof event.eventId !== "string" ||
      typeof event.providerReservationId !== "string" ||
      !["confirmed", "failed", "cancelled"].includes(String(event.status))
    ) {
      throw new BookingError("INVALID_REQUEST", "รูปแบบ webhook ไม่ถูกต้อง");
    }
    return {
      eventId: event.eventId,
      providerReservationId: event.providerReservationId,
      status: event.status as BookingStatus,
    };
  }
}
