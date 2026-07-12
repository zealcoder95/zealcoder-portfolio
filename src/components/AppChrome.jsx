"use client";

import { usePathname } from "next/navigation";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LoadingScreen from "@/components/LoadingScreen";
import FloatingAssistant from "@/components/FloatingAssistant";

export default function AppChrome({ children }) {
  const pathname = usePathname();

  const isAdminRoute =
    pathname === "/admin" ||
    pathname?.startsWith("/admin/");

  if (isAdminRoute) {
    return <>{children}</>;
  }

  return (
    <>
      <LoadingScreen />
      <Navbar />

      {children}

      <Footer />
      <FloatingAssistant />
    </>
  );
}
