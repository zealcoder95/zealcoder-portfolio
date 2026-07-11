function normalize(value = "") {
  return String(value)
    .toLocaleLowerCase("tr")
    .replace(/[^\p{L}\p{N}\s-]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const IGNORED_TERMS = new Set([
  "about",
  "also",
  "among",
  "and",
  "are",
  "bir",
  "bu",
  "bunlar",
  "bunlardan",
  "for",
  "from",
  "gizem",
  "hangisi",
  "how",
  "ile",
  "için",
  "nedir",
  "olan",
  "project",
  "projects",
  "proje",
  "projeler",
  "show",
  "that",
  "the",
  "this",
  "what",
  "which",
  "who",
  "why",
  "should",
  "could",
  "would",
  "does",
  "use",
]);

function getTerms(value = "") {
  return normalize(value)
    .split(" ")
    .filter(
      (term) =>
        term.length > 2 &&
        !IGNORED_TERMS.has(term)
    );
}

function cleanMarkdown(value = "") {
  return String(value)
    .replace(/^---[\s\S]*?---/m, " ")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/!\[[^\]]*]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)]\([^)]*\)/g, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/[*_~`>|]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function splitMarkdownByHeadings(markdown = "") {
  const lines = String(markdown).split("\n");
  const chunks = [];

  let heading = "Overview";
  let content = [];

  function saveChunk() {
    const text = cleanMarkdown(
      content.join("\n")
    );

    if (text) {
      chunks.push({
        heading,
        text,
      });
    }

    content = [];
  }

  for (const line of lines) {
    const headingMatch = line.match(
      /^(#{1,6})\s+(.+)$/
    );

    if (headingMatch) {
      saveChunk();
      heading = headingMatch[2].trim();
      continue;
    }

    content.push(line);
  }

  saveChunk();

  return chunks;
}

function scoreChunk(
  chunk,
  project,
  terms
) {
  const heading = normalize(chunk.heading);
  const text = normalize(chunk.text);

  const projectTitle = normalize(
    project.title
  );

  const projectCategory = normalize(
    project.category
  );

  const projectLanguage = normalize(
    project.language
  );

  const projectSummary = normalize(
    project.summary
  );

  const technologies = normalize(
    (project.technologies || []).join(" ")
  );

  const skills = normalize(
    (project.skills || []).join(" ")
  );

  const tags = normalize(
    (project.tags || []).join(" ")
  );

  return terms.reduce((score, term) => {
    let termScore = 0;

    if (heading.includes(term)) {
      termScore += 10;
    }

    if (projectTitle.includes(term)) {
      termScore += 8;
    }

    if (technologies.includes(term)) {
      termScore += 7;
    }

    if (skills.includes(term)) {
      termScore += 6;
    }

    if (tags.includes(term)) {
      termScore += 5;
    }

    if (projectCategory.includes(term)) {
      termScore += 4;
    }

    if (projectSummary.includes(term)) {
      termScore += 3;
    }

    if (projectLanguage.includes(term)) {
      termScore += 2;
    }

    if (text.includes(term)) {
      termScore += 2;
    }

    return score + termScore;
  }, 0);
}

function truncate(value = "", limit = 650) {
  const characters = Array.from(
    String(value)
  );

  return characters.length > limit
    ? `${characters
        .slice(0, limit)
        .join("")
        .trim()}...`
    : String(value).trim();
}

export function retrieveProjectEvidence({
  projects = [],
  message = "",
  history = [],
  maxProjects = 3,
  chunksPerProject = 2,
}) {
  const recentUserMessages = history
    .filter((item) => item.role === "user")
    .slice(-2)
    .map((item) => item.text);

  const query = [
    ...recentUserMessages,
    message,
  ].join(" ");

  const terms = getTerms(query);

  return projects
    .map((project) => {
      const chunks =
        splitMarkdownByHeadings(
          project.readme || ""
        );

      const rankedChunks = chunks
        .map((chunk) => ({
          ...chunk,
          score: scoreChunk(
            chunk,
            project,
            terms
          ),
        }))
        .sort(
          (a, b) => b.score - a.score
        );

      const positiveChunks =
        rankedChunks.filter(
          (chunk) => chunk.score > 0
        );

      const selectedChunks =
        positiveChunks.length > 0
          ? positiveChunks.slice(
              0,
              chunksPerProject
            )
          : rankedChunks.slice(0, 1);

      const projectScore =
        selectedChunks.reduce(
          (total, chunk) =>
            total + chunk.score,
          0
        );

      return {
        ...project,

        evidence: selectedChunks.map(
          (chunk) => ({
            heading: chunk.heading,
            text: truncate(chunk.text),
            score: chunk.score,
          })
        ),

        retrievalScore: projectScore,
      };
    })
    .sort((a, b) => {
      if (
        b.retrievalScore !==
        a.retrievalScore
      ) {
        return (
          b.retrievalScore -
          a.retrievalScore
        );
      }

      return (
        new Date(
          b.pushedAt ||
            b.updatedAt ||
            0
        ) -
        new Date(
          a.pushedAt ||
            a.updatedAt ||
            0
        )
      );
    })
    .slice(0, maxProjects);
}