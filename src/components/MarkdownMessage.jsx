"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function MarkdownMessage({ children }) {
  return (
    <div className="prose prose-invert max-w-none prose-p:my-2 prose-headings:mb-2 prose-headings:mt-4 prose-ul:my-2 prose-li:my-1 prose-strong:text-cyan-300 prose-code:text-green-300 prose-pre:bg-slate-900 prose-pre:border prose-pre:border-slate-700">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {children}
      </ReactMarkdown>
    </div>
  );
}