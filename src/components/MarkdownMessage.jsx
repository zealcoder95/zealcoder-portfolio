"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import ProjectCard from "./ProjectCard";

function extractProjectCards(text = "") {
  const blocks = text.split(/\n-{3,}\n/g);
  const cards = [];
  const remainingBlocks = [];

  for (const block of blocks) {
    const projectMatch = block.match(
      /(?:Project|Proje):\s*(.+)/i
    );

    const githubMatch = block.match(
      /GitHub:\s*(https?:\/\/\S+)/i
    );

    const kaggleMatch = block.match(
      /Kaggle:\s*(https?:\/\/\S+)/i
    );

    const technologiesMatch = block.match(
      /(?:Technologies|Teknolojiler|Tags|Etiketler):\s*(.+)/i
    );

    if (projectMatch && githubMatch) {
      cards.push({
        title: projectMatch[1].trim(),
        githubUrl: githubMatch[1].trim(),
        kaggleUrl: kaggleMatch?.[1]?.trim() || null,
        technologies: technologiesMatch
          ? technologiesMatch[1]
              .split(",")
              .map((item) => item.trim())
              .filter(Boolean)
          : [],
      });
    } else {
      remainingBlocks.push(block);
    }
  }

  return {
    markdown: remainingBlocks.join("\n\n---\n\n"),
    cards,
  };
}

export default function MarkdownMessage({ children }) {
  const text = String(children || "");
  const { markdown, cards } = extractProjectCards(text);

  return (
    <div>
      <div className="prose prose-invert max-w-none prose-headings:mb-2 prose-headings:mt-4 prose-p:my-2 prose-ul:my-2 prose-li:my-1 prose-strong:text-cyan-300 prose-code:text-green-300 prose-pre:border prose-pre:border-slate-700 prose-pre:bg-slate-900">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            a({ href, children: linkChildren }) {
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
          {markdown}
        </ReactMarkdown>
      </div>

      {cards.map((card) => (
        <ProjectCard
          key={`${card.title}-${card.githubUrl}`}
          {...card}
        />
      ))}
    </div>
  );
}