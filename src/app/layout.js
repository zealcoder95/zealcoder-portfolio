import "./globals.css";

import { LanguageProvider } from "@/context/LanguageContext";

import AppChrome from "@/components/AppChrome";

import Script from "next/script";

const siteUrl = "https://zealcoder.vercel.app";

export const metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: "ZealCoder",
  title: {
    default: "ZealCoder | Gizem Gülcü",
    template: "%s | ZealCoder",
  },
  description:
    "Building intelligent solutions through data, machine learning and artificial intelligence. Explore real-world case studies, engineering projects, learning resources, research notes and technical insights by Gizem Gülcü.",
  keywords: [
    "Gizem Gülcü",
    "ZealCoder",
    "AI Engineer",
    "Data Scientist",
    "Machine Learning",
    "Deep Learning",
    "Artificial Intelligence",
    "Generative AI",
    "LLM",
    "Prompt Engineering",
    "Data Analysis",
    "Data Visualization",
    "Feature Engineering",
    "Forecasting",
    "Python",
    "SQL",
    "Power BI",
    "Next.js",
    "Portfolio",
    "Engineering",
    "Case Studies",
    "Learning Hub",
    "Research",
  ],
  authors: [
    {
      name: "Gizem Gülcü",
      url: siteUrl,
    },
  ],
  creator: "Gizem Gülcü",
  publisher: "ZealCoder",
  category: "Technology",
  alternates: {
    canonical: "/",
    languages: {
      "tr-TR": "/",
      "en-US": "/en",
    },
  },
  openGraph: {
    title: "ZealCoder | AI • Data Science • Engineering",
    description:
      "Discover AI, Machine Learning, Data Science, engineering projects, technical articles and learning resources.",
    url: siteUrl,
    siteName: "ZealCoder",
    locale: "tr_TR",
    alternateLocale: ["en_US"],
    type: "website",
    images: [
      {
        url: "/assets/zealcoder-logo.png",
        width: 1200,
        height: 630,
        alt: "ZealCoder",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ZealCoder",
    description:
      "AI • Data Science • Engineering • Learning Platform",
    images: ["/assets/zealcoder-logo.png"],
    creator: "@zealcoder",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-video-preview": -1,
      "max-snippet": -1,
    },
  },
  formatDetection: {
    telephone: false,
    address: false,
    email: false,
  },
  icons: {
    icon: "/assets/zealcoder-logo.png",
    shortcut: "/assets/zealcoder-logo.png",
    apple: "/assets/zealcoder-logo.png",
  },
  manifest: "/site.webmanifest",
  referrer: "origin-when-cross-origin",
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
  knowsAbout: [
    "Artificial Intelligence",
    "Machine Learning",
    "Deep Learning",
    "Python",
    "SQL",
    "Power BI",
    "Data Science",
    "Data Analysis",
    "Next.js",
    "Data Visualization",
    "Generative AI",
  ],
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
    <html lang="tr" suppressHydrationWarning>
      <body
        className="
          bg-slate-950
          text-slate-100
          antialiased
          overflow-x-hidden
          selection:bg-indigo-600
          selection:text-white
        "
      >
        <Script
          id="person-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(personSchema),
          }}
        />
        <Script
          id="website-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />
        <LanguageProvider>
          <AppChrome>{children}</AppChrome>
        </LanguageProvider>
      </body>
    </html>
  );
}