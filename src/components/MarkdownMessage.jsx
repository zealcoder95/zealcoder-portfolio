"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function MarkdownMessage({
  children,
}) {
  const text = String(children || "");

  return (
    <div className="prose prose-invert max-w-none text-sm prose-headings:mb-2 prose-headings:mt-5 prose-headings:text-white prose-p:my-2 prose-p:leading-7 prose-ul:my-3 prose-ol:my-3 prose-li:my-1 prose-strong:text-cyan-300 prose-code:text-green-300 prose-pre:border prose-pre:border-slate-700 prose-pre:bg-slate-900">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a({
            href,
            children: linkChildren,
          }) {
            return (
              <a
                href={href}
                target="_blank"
                rel="noreferrer"
                className="text-cyan-300 underline decoration-cyan-300/30 underline-offset-4"
              >
                {linkChildren}
              </a>
            );
          },
        }}
      >
        {text}
      </ReactMarkdown>
    </div>
  );
}