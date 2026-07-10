import matter from "gray-matter";

const GITHUB_USERNAME = "zealcoder95";
const GITHUB_API = "https://api.github.com";

function removeHtml(markdown = "") {
  return markdown
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<picture[\s\S]*?<\/picture>/gi, "")
    .replace(/<p[^>]*align=["']?center["']?[^>]*>[\s\S]*?<\/p>/gi, "")
    .replace(/<[^>]+>/g, " ");
}

function cleanMarkdown(markdown = "") {
  return removeHtml(markdown)
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/!\[[^\]]*]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)]\([^)]*\)/g, "$1")
    .replace(/https?:\/\/\S+/g, " ")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^[-*+]\s+/gm, "")
    .replace(/[*_~`>#|]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function createSummary(markdown = "", fallback = "") {
  const clean = cleanMarkdown(markdown);

  if (!clean) {
    return fallback || "Project details are available on GitHub.";
  }

  const characters = Array.from(clean);

  if (characters.length <= 240) {
    return clean;
  }

  return `${characters.slice(0, 240).join("").trim()}...`;
}

function findKaggleUrl(markdown = "") {
  const match = markdown.match(
    /https?:\/\/(?:www\.)?kaggle\.com\/(?:code|notebooks)\/[^\s)"']+/i
  );

  return match ? match[0] : null;
}

function findFirstImage(markdown = "") {
  // Markdown görseli: ![alt](images/cover.png)
  const markdownImage = markdown.match(/!\[[^\]]*]\(([^)\s]+)(?:\s+"[^"]*")?\)/);

  if (markdownImage?.[1]) {
    return markdownImage[1];
  }

  // HTML görseli: <img src="images/cover.png" />
  const htmlImage = markdown.match(/<img[^>]+src=["']([^"']+)["'][^>]*>/i);

  return htmlImage?.[1] || null;
}

function resolveGitHubAssetUrl({
  source,
  repoName,
  defaultBranch,
}) {
  if (!source) return null;

  if (
    source.startsWith("http://") ||
    source.startsWith("https://") ||
    source.startsWith("data:")
  ) {
    return source;
  }

  const cleanSource = source
    .replace(/^\.\//, "")
    .replace(/^\//, "");

  return `https://raw.githubusercontent.com/${GITHUB_USERNAME}/${repoName}/${defaultBranch}/${cleanSource}`;
}

function titleFromRepoName(name = "") {
  return name
    .replaceAll("-", " ")
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

async function githubFetch(path) {
  const response = await fetch(`${GITHUB_API}${path}`, {
    headers: {
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
    next: {
      revalidate: 3600,
    },
  });

  if (!response.ok) {
    return null;
  }

  return response;
}

async function getRepositoryReadme(repoName) {
  const response = await fetch(
    `${GITHUB_API}/repos/${GITHUB_USERNAME}/${repoName}/readme`,
    {
      headers: {
        Accept: "application/vnd.github.raw+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
      next: {
        revalidate: 3600,
      },
    }
  );

  if (!response.ok) {
    return {
      metadata: {},
      markdown: "",
    };
  }

  const rawReadme = await response.text();
  const parsed = matter(rawReadme);

  return {
    metadata: parsed.data || {},
    markdown: parsed.content || "",
  };
}

export async function getGitHubProjects() {
  const response = await githubFetch(
    `/users/${GITHUB_USERNAME}/repos?sort=updated&direction=desc&per_page=100`
  );

  if (!response) {
    throw new Error("GitHub repositories could not be loaded.");
  }

  const repositories = await response.json();

  const usableRepositories = repositories.filter(
    (repo) =>
      !repo.fork &&
      !repo.archived &&
      Array.isArray(repo.topics) &&
      repo.topics.includes("portfolio")
  );

  const projects = await Promise.all(
    usableRepositories.map(async (repo) => {
      const { metadata, markdown } = await getRepositoryReadme(repo.name);

      const defaultBranch = repo.default_branch || "main";

      const coverSource =
        metadata.cover ||
        metadata.image ||
        findFirstImage(markdown);

      const coverUrl = resolveGitHubAssetUrl({
        source: coverSource,
        repoName: repo.name,
        defaultBranch,
      });

      return {
        id: repo.id,
        slug: repo.name,

        title:
          metadata.title ||
          titleFromRepoName(repo.name),

        summary:
          metadata.summary ||
          createSummary(markdown, repo.description),

        description: repo.description || "",

        category:
          metadata.category ||
          repo.language ||
          "Project",

        tags: Array.isArray(metadata.tags)
          ? metadata.tags
          : repo.topics.filter((topic) => topic !== "portfolio"),

        featured: metadata.featured === true,

        cover: coverUrl,

        kaggleUrl:
          metadata.kaggle ||
          metadata.kaggleUrl ||
          findKaggleUrl(markdown),

        githubUrl: repo.html_url,

        defaultBranch,

        homepage:
          metadata.demo ||
          repo.homepage ||
          null,

        language: repo.language,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        updatedAt: repo.updated_at,
        readme: markdown,
      };
    })
  );

  return projects.sort((a, b) => {
    if (a.featured !== b.featured) {
      return a.featured ? -1 : 1;
    }

    return new Date(b.updatedAt) - new Date(a.updatedAt);
  });
}

export async function getGitHubProject(slug) {
  const projects = await getGitHubProjects();

  return projects.find((project) => project.slug === slug) || null;
}