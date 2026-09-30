import assert from "node:assert/strict";
import test from "node:test";
import { MockPmsProvider } from "./mock-provider";

const criteria = {
  checkIn: "2030-01-10",
  checkOut: "2030-01-12",
  adults: 2,
  children: 0,
  rooms: 1,
};

test("mock PMS returns normalized offers with an all-in price", async () => {
  const provider = new MockPmsProvider();
  const offers = await provider.searchAvailability(criteria);
  assert.ok(offers.length > 0);
  assert.equal(offers[0].price.total, offers[0].price.subtotal + offers[0].price.taxes + offers[0].price.fees);
  assert.equal(offers[0].price.currency, "THB");
});

test("mock PMS creates a pending payment reservation", async () => {
  const provider = new MockPmsProvider();
  const [offer] = await provider.searchAvailability(criteria);
  const reservation = await provider.createReservation({
    offerId: offer.offerId,
    criteria,
    guest: { firstName: "Rada", lastName: "Guest", email: "guest@example.com", phone: "0812345678", country: "Thailand" },
  }, "test-idempotency-key");
  assert.equal(reservation.status, "pending_payment");
  assert.match(reservation.providerReservationId, /^MOCK-/);
});

test("mock webhook rejects an invalid shape", async () => {
  const provider = new MockPmsProvider();
  await assert.rejects(() => provider.handleWebhook({ status: "confirmed" }));
});
