import "server-only";
import { mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { DatabaseSync } from "node:sqlite";
import type { BookingRecord, BookingStatus } from "./types";

export interface BookingRepository {
  findByReference(reference: string): BookingRecord | null;
  findByIdempotencyKey(key: string): BookingRecord | null;
  findByProviderReservationId(id: string): BookingRecord | null;
  create(record: BookingRecord): void;
  updateStatus(reference: string, status: BookingStatus): void;
  recordEvent(eventId: string, provider: string): boolean;
}

let database: DatabaseSync | undefined;

function getDatabase() {
  if (database) return database;
  const configuredPath = process.env.BOOKING_DB_PATH;
  const path = configuredPath
    ? resolve(/* turbopackIgnore: true */ configuredPath)
    : join(process.cwd(), "data", "bookings.db");
  mkdirSync(dirname(path), { recursive: true });
  database = new DatabaseSync(path);
  database.exec(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS bookings (
      reference TEXT PRIMARY KEY,
      provider TEXT NOT NULL,
      provider_reservation_id TEXT NOT NULL UNIQUE,
      idempotency_key TEXT NOT NULL UNIQUE,
      status TEXT NOT NULL,
      total INTEGER NOT NULL,
      currency TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS webhook_events (
      event_id TEXT PRIMARY KEY,
      provider TEXT NOT NULL,
      processed_at TEXT NOT NULL
    );
  `);
  return database;
}

function toRecord(row: Record<string, unknown>): BookingRecord {
  return {
    reference: String(row.reference),
    provider: String(row.provider),
    providerReservationId: String(row.provider_reservation_id),
    idempotencyKey: String(row.idempotency_key),
    status: String(row.status) as BookingStatus,
    total: Number(row.total),
    currency: String(row.currency),
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
  };
}

export class SqliteBookingRepository implements BookingRepository {
  findByReference(reference: string) {
    const row = getDatabase()
      .prepare("SELECT * FROM bookings WHERE reference = ?")
      .get(reference) as Record<string, unknown> | undefined;
    return row ? toRecord(row) : null;
  }

  findByIdempotencyKey(key: string) {
    const row = getDatabase()
      .prepare("SELECT * FROM bookings WHERE idempotency_key = ?")
      .get(key) as Record<string, unknown> | undefined;
    return row ? toRecord(row) : null;
  }

  findByProviderReservationId(id: string) {
    const row = getDatabase()
      .prepare("SELECT * FROM bookings WHERE provider_reservation_id = ?")
      .get(id) as Record<string, unknown> | undefined;
    return row ? toRecord(row) : null;
  }

  create(record: BookingRecord) {
    getDatabase()
      .prepare(
        `INSERT INTO bookings
        (reference, provider, provider_reservation_id, idempotency_key, status, total, currency, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .run(
        record.reference,
        record.provider,
        record.providerReservationId,
        record.idempotencyKey,
        record.status,
        record.total,
        record.currency,
        record.createdAt,
        record.updatedAt,
      );
  }

  updateStatus(reference: string, status: BookingStatus) {
    getDatabase()
      .prepare("UPDATE bookings SET status = ?, updated_at = ? WHERE reference = ?")
      .run(status, new Date().toISOString(), reference);
  }

  recordEvent(eventId: string, provider: string) {
    try {
      getDatabase()
        .prepare("INSERT INTO webhook_events (event_id, provider, processed_at) VALUES (?, ?, ?)")
        .run(eventId, provider, new Date().toISOString());
      return true;
    } catch (error) {
      if (String(error).includes("UNIQUE constraint failed")) return false;
      throw error;
    }
  }
}

let repository: BookingRepository | undefined;
export function getBookingRepository() {
  repository ??= new SqliteBookingRepository();
  return repository;
}
