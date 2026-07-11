import Parser from "rss-parser";

const GITHUB_USERNAME = "zealcoder95";
const MEDIUM_USERNAME = "zealcoder";

const parser = new Parser();

function createUpdate({
  id,
  platform,
  action,
  title,
  description,
  date,
  url,
}) {
  return {
    id,
    platform,
    action,
    title,
    description,
    date,
    url,
  };
}

async function getGitHubUpdates() {
  try {
    const response = await fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=pushed&direction=desc&per_page=10`,
      {
        headers: {
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28",
        },
        next: {
          revalidate: 1800,
        },
      }
    );

    if (!response.ok) {
      console.error(
        "GitHub updates could not be loaded:",
        response.status
      );

      return [];
    }

    const repositories = await response.json();

    return repositories
      .filter(
        (repo) =>
          !repo.fork &&
          !repo.archived &&
          repo.name !== GITHUB_USERNAME
      )
      .map((repo) =>
        createUpdate({
          id: `github-${repo.id}-${repo.pushed_at}`,
          platform: "github",
          action: "updated",
          title: repo.name
            .replaceAll("-", " ")
            .replaceAll("_", " ")
            .replace(/\b\w/g, (letter) =>
              letter.toUpperCase()
            ),
          description:
            repo.description ||
            "GitHub projesinde yeni bir güncelleme yayımlandı.",
          date: repo.pushed_at || repo.updated_at,
          url: repo.html_url,
        })
      );
  } catch (error) {
    console.error("GitHub updates error:", error);
    return [];
  }
}

async function getMediumUpdates() {
  try {
    const feed = await parser.parseURL(
      `https://medium.com/feed/@${MEDIUM_USERNAME}`
    );

    return (feed.items || [])
      .slice(0, 10)
      .map((item) =>
        createUpdate({
          id:
            item.guid ||
            `medium-${item.link}-${item.isoDate}`,
          platform: "medium",
          action: "published",
          title: item.title || "Yeni Medium yazısı",
          description:
            item.contentSnippet ||
            "Medium hesabında yeni bir yazı yayımlandı.",
          date:
            item.isoDate ||
            item.pubDate ||
            new Date().toISOString(),
          url:
            item.link ||
            `https://medium.com/@${MEDIUM_USERNAME}`,
        })
      );
  } catch (error) {
    console.error("Medium updates error:", error);
    return [];
  }
}

export async function getAutomaticUpdates({
  limit = 6,
} = {}) {
  const [githubUpdates, mediumUpdates] =
    await Promise.all([
      getGitHubUpdates(),
      getMediumUpdates(),
    ]);

  return [
    ...githubUpdates,
    ...mediumUpdates,
  ]
    .filter((update) => update.date)
    .sort(
      (a, b) =>
        new Date(b.date).getTime() -
        new Date(a.date).getTime()
    )
    .slice(0, limit);
}