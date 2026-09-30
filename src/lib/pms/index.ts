import type { PmsProvider } from "@/lib/booking/types";
import { MockPmsProvider } from "./mock-provider";

export function getPmsProvider(): PmsProvider {
  const provider = process.env.PMS_PROVIDER ?? "mock";
  switch (provider) {
    case "mock":
      return new MockPmsProvider();
    default:
      throw new Error(`Unsupported PMS provider: ${provider}`);
  }
}
