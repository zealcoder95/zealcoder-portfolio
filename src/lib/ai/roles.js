function normalize(value = "") {
  return String(value)
    .toLocaleLowerCase("tr")
    .replace(/[^\p{L}\p{N}\s+#.-]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const ROLE_RULES = [
  {
    role: "Junior Data Analyst",
    keywords: [
      "python",
      "pandas",
      "numpy",
      "sql",
      "eda",
      "data analysis",
      "data cleaning",
      "data visualization",
      "matplotlib",
      "seaborn",
    ],
  },
  {
    role: "Junior Business Intelligence Analyst",
    keywords: [
      "sql",
      "power bi",
      "dashboard",
      "reporting",
      "business intelligence",
      "data visualization",
      "database",
    ],
  },
  {
    role: "Junior Database Developer",
    keywords: [
      "sql",
      "t-sql",
      "tsql",
      "database design",
      "stored procedures",
      "views",
      "normalization",
      "query optimization",
      "indexing",
    ],
  },
  {
    role: "Data Science Intern",
    keywords: [
      "python",
      "pandas",
      "numpy",
      "machine learning",
      "statistics",
      "data analysis",
      "feature engineering",
      "scikit-learn",
    ],
  },
  {
    role: "Junior Machine Learning Engineer",
    keywords: [
      "machine learning",
      "scikit-learn",
      "tensorflow",
      "pytorch",
      "model training",
      "classification",
      "regression",
      "forecasting",
    ],
  },
  {
    role: "Junior AI Engineer",
    keywords: [
      "artificial intelligence",
      "ai",
      "llm",
      "rag",
      "gemini",
      "ai agent",
      "prompt engineering",
      "machine learning",
    ],
  },
];

function getProjectEvidence(project) {
  return normalize(
    [
      project.title,
      project.category,
      project.summary,
      project.language,
      ...(project.technologies || []),
      ...(project.skills || []),
      ...(project.tags || []),
      ...(project.evidence || []).flatMap((item) => [
        item.heading,
        item.text,
      ]),
    ]
      .filter(Boolean)
      .join(" ")
  );
}

export function matchPortfolioRoles(
  projects = [],
  limit = 4
) {
  const scoredRoles = ROLE_RULES.map((rule) => {
    const matchedKeywords = new Set();
    const supportingProjects = new Set();

    for (const project of projects) {
      const evidence = getProjectEvidence(project);

      for (const keyword of rule.keywords) {
        const normalizedKeyword = normalize(keyword);

        if (evidence.includes(normalizedKeyword)) {
          matchedKeywords.add(keyword);
          supportingProjects.add(project.title);
        }
      }
    }

    return {
      role: rule.role,
      score: matchedKeywords.size,
      matchedKeywords: [...matchedKeywords],
      supportingProjects: [...supportingProjects],
    };
  });

  return scoredRoles
    .filter((item) => item.score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }

      return (
        b.supportingProjects.length -
        a.supportingProjects.length
      );
    })
    .slice(0, limit);
}

export function formatRoleMatches(roleMatches = []) {
  if (!roleMatches.length) {
    return "No evidence-based role matches were identified.";
  }

  return roleMatches
    .map((item, index) => {
      const evidence =
        item.matchedKeywords.length > 0
          ? item.matchedKeywords.join(", ")
          : "Limited evidence";

      const projects =
        item.supportingProjects.length > 0
          ? item.supportingProjects.join(", ")
          : "No specific project";

      return `
${index + 1}. ${item.role}
Evidence: ${evidence}
Supporting projects: ${projects}
`;
    })
    .join("\n");
}