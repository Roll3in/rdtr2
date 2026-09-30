export class BookingError extends Error {
  constructor(
    public code:
      | "INVALID_REQUEST"
      | "OFFER_EXPIRED"
      | "PRICE_CHANGED"
      | "NOT_AVAILABLE"
      | "PROVIDER_UNAVAILABLE"
      | "NOT_FOUND",
    message: string,
    public status = 400,
  ) {
    super(message);
  }
}
