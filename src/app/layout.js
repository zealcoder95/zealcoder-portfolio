import "./globals.css";

import { LanguageProvider } from "@/context/LanguageContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LoadingScreen from "@/components/LoadingScreen";
import FloatingAssistant from "@/components/FloatingAssistant";

export const metadata = {
  metadataBase: new URL("https://zealcoder.vercel.app"),

  title: {
    default: "ZealCoder | Gizem Gülcü",
    template: "%s | ZealCoder",
  },

  description:
    "Gizem Gülcü’nün veri bilimi, makine öğrenmesi ve yapay zekâ mühendisliği projelerini paylaştığı kişisel teknoloji platformu.",

  keywords: [
    "Gizem Gülcü",
    "ZealCoder",
    "Data Science",
    "Machine Learning",
    "Artificial Intelligence",
    "AI Engineering",
    "Python",
    "SQL",
    "Power BI",
    "Portfolio",
  ],

  authors: [
    {
      name: "Gizem Gülcü",
    },
  ],

  creator: "Gizem Gülcü",

  openGraph: {
    title: "ZealCoder | Gizem Gülcü",
    description:
      "Data Science, Machine Learning and AI Engineering projects.",
    url: "/",
    siteName: "ZealCoder",
    type: "website",
    locale: "tr_TR",
    alternateLocale: ["en_US"],
    images: [
      {
        url: "/assets/zealcoder-logo.png",
        width: 1200,
        height: 630,
        alt: "ZealCoder — Gizem Gülcü",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "ZealCoder | Gizem Gülcü",
    description:
      "Data Science, Machine Learning and AI Engineering projects.",
    images: ["/assets/zealcoder-logo.png"],
  },

  icons: {
    icon: "/assets/zealcoder-logo.png",
    shortcut: "/assets/zealcoder-logo.png",
    apple: "/assets/zealcoder-logo.png",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body className="bg-slate-950 text-white antialiased">
        <LanguageProvider>
          <LoadingScreen />
          <Navbar />

          {children}

          <Footer />
          <FloatingAssistant />
        </LanguageProvider>
      </body>
    </html>
  );
}