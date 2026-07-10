"use client";

import { useState } from "react";
import Terminal from "@/components/Terminal";

export default function FloatingAssistant() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-[999]">
      {open && (
        <div className="mb-4 w-[380px] max-w-[90vw]">
          <Terminal />
        </div>
      )}

      <button
        onClick={() => setOpen(!open)}
        className="rounded-full bg-gradient-to-r from-purple-600 to-cyan-500 px-6 py-4 font-bold text-white shadow-2xl shadow-cyan-500/30 transition hover:-translate-y-1"
      >
        {open ? "Close" : "Ask ZealCoder"}
      </button>
    </div>
  );
}