import "./globals.css";
import "@/styles/overrides.css";

import { LanguageProvider } from "@/context/LanguageContext";
import AppChrome from "@/components/AppChrome";
import Script from "next/script";

const siteUrl = "https://zealcoder.vercel.app";

export const metadata = {
  // ... metadata satırlarının tamamı ...
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#020617",
  colorScheme: "dark",
};

const personSchema = { /* ... */ };
const websiteSchema = { /* ... */ };

export default function RootLayout({ children }) {
  return (
    <html lang="tr" data-scroll-behavior="smooth">
      <body className="bg-slate-950 text-slate-100 antialiased">
        <Script
          id="person-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        <Script
          id="website-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <LanguageProvider>
          <AppChrome>{children}</AppChrome>
        </LanguageProvider>
      </body>
    </html>
  );
}