export interface ConfirmationEmail {
  to: string;
  guestName: string;
  bookingReference: string;
}

export interface EmailProvider {
  sendConfirmation(message: ConfirmationEmail): Promise<void>;
}

export class MockEmailProvider implements EmailProvider {
  async sendConfirmation() {
    // Intentionally empty: replace through this adapter when an email provider is selected.
  }
}
