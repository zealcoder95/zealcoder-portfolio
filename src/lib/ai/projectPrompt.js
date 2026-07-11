function truncateText(value = "", limit = 420) {
  const text = String(value || "").trim();
  const characters = Array.from(text);

  return characters.length > limit
    ? `${characters.slice(0, limit).join("").trim()}...`
    : text;
}

function formatEvidence(evidence = []) {
  if (!evidence.length) {
    return "No relevant README evidence was found.";
  }

  return evidence
    .map(
      (item) => `
SECTION: ${item.heading}
EVIDENCE: ${truncateText(item.text)}
`
    )
    .join("\n");
}

function projectContext(project) {
  return `
PROJECT: ${project.title}
CATEGORY: ${project.category || "Unknown"}
TECHNOLOGIES: ${(project.technologies || []).join(", ") || "Unknown"}
SKILLS: ${(project.skills || []).join(", ") || "Unknown"}

RELEVANT EVIDENCE:
${formatEvidence(project.evidence)}
`;
}

function formatHistory(history = []) {
  const recentHistory = history.slice(-4);

  if (!recentHistory.length) {
    return "No previous conversation.";
  }

  return recentHistory
    .map((item) => {
      const speaker =
        item.role === "user" ? "VISITOR" : "ASSISTANT";

      return `${speaker}: ${truncateText(item.text, 300)}`;
    })
    .join("\n");
}

export function buildProjectPrompt({
  message,
  history,
  projects,
}) {
  return `
You are the project explorer for Gizem Gülcü's portfolio.

Answer the visitor's project question directly and briefly.

STRICT OUTPUT RULES:
- Keep the answer under 70 words.
- Do not write headings such as "Summary", "Technologies", "GitHub", "Kaggle", or "Live Demo".
- Do not list raw URLs.
- Do not reproduce project-card fields.
- Do not repeat the complete project description.
- Do not say "details are below".
- Mention at most two technical strengths.
- The interface will display project cards after your answer.
- Let the cards provide titles, summaries, technologies, and links.

LANGUAGE:
- Answer in Turkish when the visitor writes in Turkish.
- Answer in English when the visitor writes in English.

ACCURACY:
- Use only the supplied project evidence.
- Never invent technologies, outcomes, or experience.
- Explain why the project matches the visitor's question.
- For a list request, give one concise sentence per relevant project.
- For a technical question, answer using the selected README evidence.
- For comparisons, explain the deciding evidence briefly.

PREVIOUS CONVERSATION:
${formatHistory(history)}

RELEVANT PROJECTS:
${projects.map(projectContext).join("\n---\n")}

VISITOR QUESTION:
${message}
`;
}