function normalize(value = "") {
  return value
    .toLocaleLowerCase("tr")
    .replace(/[.,!?;:()[\]{}"'`]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function searchableText(project) {
  return normalize(
    [
      project.slug,
      project.title,
      project.summary,
      project.description,
      project.category,
      project.language,
      ...(project.tags || []),
      project.readme,
    ]
      .filter(Boolean)
      .join(" ")
  );
}

function conversationQuery(message, history = []) {
  const recentUserMessages = history
    .filter((item) => item.role === "user")
    .slice(-3)
    .map((item) => item.text);

  return [...recentUserMessages, message].join(" ");
}

const ignoredTerms = new Set([
  "olan",
  "hangisi",
  "bunlardan",
  "göster",
  "proje",
  "projeler",
  "project",
  "projects",
  "which",
  "what",
  "show",
  "most",
  "the",
  "and",
  "bir",
  "ile",
  "için",
]);

export function removeNonPortfolioProfiles(projects = []) {
  return projects.filter((project) => {
    const slug = normalize(project.slug || "");
    const title = normalize(project.title || "");

    return slug !== "zealcoder95" && title !== "zealcoder95";
  });
}

export function findRelevantProjects(
  projects,
  message,
  history = [],
  limit = 6
) {
  const terms = normalize(conversationQuery(message, history))
    .split(" ")
    .filter(
      (term) =>
        term.length > 2 &&
        !ignoredTerms.has(term)
    );

  const ranked = projects.map((project) => {
    const text = searchableText(project);

    let score = 0;

    for (const term of terms) {
      if (normalize(project.title).includes(term))
        score += 7;

      if (
        normalize(project.language || "").includes(term)
      )
        score += 5;

      if (
        (project.tags || []).some((tag) =>
          normalize(tag).includes(term)
        )
      )
        score += 5;

      if (
        normalize(project.category || "").includes(
          term
        )
      )
        score += 3;

      if (text.includes(term))
        score += 1;
    }

    return {
      project,
      score,
    };
  });

  const matches = ranked
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.project);

  return matches.length
    ? matches
    : projects.slice(0, limit);
}

export function newestProject(projects = []) {
  return [...projects].sort((a, b) => {
    const ad = new Date(
      a.pushedAt ||
        a.updatedAt ||
        a.createdAt
    ).getTime();

    const bd = new Date(
      b.pushedAt ||
        b.updatedAt ||
        b.createdAt
    ).getTime();

    return bd - ad;
  })[0];
}

export function mostPopularProject(projects = []) {
  return [...projects].sort(
    (a, b) => (b.stars || 0) - (a.stars || 0)
  )[0];
}

export { normalize };