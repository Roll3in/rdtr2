import type { Metadata } from "next";
import { LanguageProvider } from "@/components/LanguageProvider";
import "@fontsource/prompt/300.css";
import "@fontsource/prompt/400.css";
import "@fontsource/prompt/500.css";
import "@fontsource/prompt/600.css";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Radateeree Boutique Resort | A Quiet Kind of Luxury", template: "%s | Radateeree Boutique Resort" },
  description: "สัมผัสการพักผ่อนเหนือระดับท่ามกลางสวนร่มรื่น ห้องพักแสนสงบ และการบริการที่อบอุ่น",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="th" data-scroll-behavior="smooth">
      <body><LanguageProvider>{children}</LanguageProvider></body>
    </html>
  );
}
