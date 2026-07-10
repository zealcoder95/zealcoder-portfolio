"use client";

import { useState } from "react";
import { assistantKnowledge } from "@/data/assistantKnowledge";

export default function Terminal() {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([
    "ZealCoder Assistant online.",
    "Ask me about Gizem, projects, skills, AI path, or what to check first.",
  ]);

  function getAnswer(question) {
    const q = question.toLowerCase();

    if (q.includes("hire") || q.includes("recruiter") || q.includes("why gizem")) {
      return [
        `${assistantKnowledge.profile.name} combines an engineering mindset with data science and AI-focused learning.`,
        `Key strengths: ${assistantKnowledge.strengths.join(", ")}.`,
        assistantKnowledge.recommendations.recruiter,
      ];
    }

    if (q.includes("who") || q.includes("about") || q.includes("gizem")) {
      return [
        `${assistantKnowledge.profile.name} is the creator of ${assistantKnowledge.profile.brand}.`,
        assistantKnowledge.profile.summary,
        `Current direction: ${assistantKnowledge.profile.role}.`,
      ];
    }

    if (q.includes("project") || q.includes("case study")) {
      return [
        assistantKnowledge.recommendations.projects,
        "Recommended order: Renewable Energy → Women Employment → NYC Schools.",
      ];
    }

    if (q.includes("skill") || q.includes("tech") || q.includes("stack")) {
      return [
        "Core strengths:",
        ...assistantKnowledge.strengths.map((item) => `• ${item}`),
      ];
    }

    if (q.includes("ai") || q.includes("machine learning") || q.includes("llm")) {
      return [
        assistantKnowledge.recommendations.ai,
        "Current AI direction: Machine Learning foundations → LLMs → RAG → AI Agents.",
      ];
    }

    if (q.includes("cv") || q.includes("resume")) {
      return [
        "The CV can be linked from the Contact section once the PDF is added.",
        "Recommended: add public/cv.pdf and connect it to the Download CV button.",
      ];
    }

    return [
      "I can currently answer about:",
      "• Gizem's profile",
      "• Projects",
      "• Skills",
      "• AI Engineering path",
      "• Recruiter recommendations",
      "Try: 'Why should I hire Gizem?'",
    ];
  }

  function handleSubmit(e) {
    e.preventDefault();

    const question = input.trim();
    if (!question) return;

    if (question.toLowerCase() === "clear") {
      setHistory([]);
      setInput("");
      return;
    }

    const response = getAnswer(question);
    setHistory((prev) => [...prev, `> ${question}`, ...response]);
    setInput("");
  }

  return (
    <div className="w-full max-w-md rounded-[2rem] border border-white/10 bg-black/70 p-5 font-mono text-sm text-slate-300 shadow-2xl shadow-purple-500/10 backdrop-blur-xl">
      <div className="mb-4 flex items-center gap-2 border-b border-white/10 pb-3">
        <span className="h-3 w-3 rounded-full bg-red-400" />
        <span className="h-3 w-3 rounded-full bg-yellow-400" />
        <span className="h-3 w-3 rounded-full bg-green-400" />
        <span className="ml-3 text-xs text-slate-500">
          zealcoder-ai-assistant
        </span>
      </div>

      <div className="mb-4 max-h-64 space-y-1 overflow-y-auto">
        {history.map((line, index) => (
          <p
            key={index}
            className={line.startsWith(">") ? "text-cyan-300" : "text-slate-300"}
          >
            {line}
          </p>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <span className="text-purple-300">ask</span>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full bg-transparent text-cyan-300 outline-none placeholder:text-slate-600"
          placeholder="Why should I hire Gizem?"
        />
        <span className="animate-pulse text-cyan-300">|</span>
      </form>
    </div>
  );
}