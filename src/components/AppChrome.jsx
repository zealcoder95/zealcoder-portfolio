"use client";

import { usePathname } from "next/navigation";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingAssistant from "@/components/FloatingAssistant";

export default function AppChrome({
  children,
}) {
  const pathname = usePathname();

  const isAdminRoute =
    pathname?.startsWith("/admin");

  // Admin Panel
  if (isAdminRoute) {
    return (
      <main className="min-h-screen bg-slate-950 text-white">
        {children}
      </main>
    );
  }

  // Public Website
  return (
    <>
      <Navbar />

      <main>{children}</main>

      <Footer />

      <FloatingAssistant />
    </>
  );
}
