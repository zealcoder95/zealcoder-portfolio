"use client";

import { useRef, useState } from "react";

export default function Terminal() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [history, setHistory] = useState([
    {
      role: "assistant",
      text: "🤖 ZealCoder AI is online.",
    },
    {
      role: "assistant",
      text:
        "Ask me anything about Gizem, Projects, GitHub, Kaggle, AI or Machine Learning.",
    },
  ]);

  const bottomRef = useRef(null);

  async function askAI(question, historySnapshot) {
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        cache: "no-store",

        body: JSON.stringify({
          message: question,

          history: historySnapshot
            .slice(-10)
            .map((item) => ({
              role: item.role,
              text: item.text,
            })),
        }),
      });

      const data = await response.json();

      console.log("ZEALCODER RESPONSE", data);

      if (!response.ok) {
        throw new Error(data.error || "Unknown error");
      }

      setHistory((prev) => [
        ...prev,
        {
          role: "assistant",
          text: data.answer,
        },
      ]);
    } catch (error) {
      console.error(error);

      setHistory((prev) => [
        ...prev,
        {
          role: "assistant",
          text:
            "⚠️ AI engine is temporarily unavailable.",
        },
      ]);
    } finally {
      setLoading(false);

      setTimeout(() => {
        bottomRef.current?.scrollIntoView({
          behavior: "smooth",
        });
      }, 100);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const question = input.trim();

    if (!question || loading) return;

    if (
      question.toLowerCase() === "clear"
    ) {
      setHistory([]);

      setInput("");

      return;
    }

    const userMessage = {
      role: "user",
      text: question,
    };

    const nextHistory = [
      ...history,
      userMessage,
    ];

    setHistory(nextHistory);

    setInput("");

    await askAI(question, nextHistory);
  }

  return (
    <div className="w-full max-w-lg rounded-[32px] border border-white/10 bg-black/70 p-6 font-mono shadow-2xl shadow-cyan-500/10 backdrop-blur-xl">

      <div className="mb-4 flex items-center gap-2 border-b border-white/10 pb-3">

        <span className="h-3 w-3 rounded-full bg-red-400"/>

        <span className="h-3 w-3 rounded-full bg-yellow-400"/>

        <span className="h-3 w-3 rounded-full bg-green-400"/>

        <span className="ml-3 text-xs text-slate-500">
          zealcoder-ai-v5
        </span>

      </div>

      <div className="mb-5 h-80 space-y-5 overflow-y-auto">

        {history.map((item,index)=>(
          <div
            key={index}
            className={
              item.role==="user"
                ? "text-cyan-300"
                : "text-slate-300"
            }
          >

            <span className="font-bold">
              {item.role==="user"
                ? "You"
                : "AI"}
            </span>

            <p className="mt-1 whitespace-pre-wrap leading-7">
              {item.text}
            </p>

          </div>
        ))}

        {loading && (

          <div className="animate-pulse text-purple-300">

            🤖 Thinking...

          </div>

        )}

        <div ref={bottomRef}/>

      </div>

      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-3 border-t border-white/10 pt-4"
      >

        <span className="text-cyan-300">{">"}</span>

        <input
          value={input}
          onChange={(e)=>setInput(e.target.value)}
          disabled={loading}
          placeholder={
            loading
              ? "AI is thinking..."
              : "Ask anything..."
          }
          className="w-full bg-transparent text-white outline-none placeholder:text-slate-600 disabled:opacity-50"
        />

      </form>

    </div>
  );
}