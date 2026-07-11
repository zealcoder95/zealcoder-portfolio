"use client";

import { useEffect, useState } from "react";

export default function LoadingScreen() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShow(false), 1800);
    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950 text-white">
      <div className="text-center">
        <img
          src="/assets/zealcoder-logo.png"
          alt="ZealCoder Logo"
          className="mx-auto mb-8 h-32 w-32 rounded-full animate-pulse drop-shadow-[0_0_35px_rgba(34,211,238,0.45)]"
        />

        <h1 className="mb-4 bg-linear-to-r from-purple-400 to-cyan-300 bg-clip-text text-4xl font-black tracking-[0.25em] text-transparent">
          ZEALCODER
        </h1>

        <p className="font-mono text-sm text-cyan-300">
          Initializing intelligence...
        </p>

        <div className="mx-auto mt-6 h-2 w-64 overflow-hidden rounded-full bg-slate-800">
          <div className="h-full w-full animate-[loading_1.8s_ease-in-out] rounded-full bg-linear-to-r from-purple-500 to-cyan-400" />
        </div>
      </div>
    </div>
  );
}