import "./globals.css";
import "@/styles/overrides.css";

import { LanguageProvider } from "@/context/LanguageContext";
import AppChrome from "@/components/AppChrome";
import Script from "next/script";

const siteUrl = "https://zealcoder.vercel.app";

export const metadata = {
  title: "ZealCoder | Gizem Gülcü",
  description:
    "Building intelligent solutions through data, machine learning and artificial intelligence.",
  // ... diğer metadata ...
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#020617",
  colorScheme: "dark",
};

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Gizem Gülcü",
  url: siteUrl,
  image: `${siteUrl}/assets/zealcoder-logo.png`,
  jobTitle: "AI Engineer & Data Scientist",
  description:
    "AI Engineer and Data Scientist building intelligent systems through data, analytics and machine learning.",
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "ZealCoder",
  url: siteUrl,
  description:
    "AI Engineering, Data Science, Learning Resources and Technical Portfolio.",
  inLanguage: ["tr", "en"],
};

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