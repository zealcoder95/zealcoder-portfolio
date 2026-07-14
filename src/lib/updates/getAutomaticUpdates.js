import { XMLParser } from "fast-xml-parser";
import { manualUpdates } from "@/data/manualUpdates";

const GITHUB_USERNAME = "zealcoder95";
const MEDIUM_USERNAME = "zealcoder";
const REQUEST_TIMEOUT_MS = 8000;

const xmlParser = new XMLParser({
  ignoreAttributes: true,
  trimValues: true,
});

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

function cleanText(value = "") {
  return String(value)
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#8217;/g, "’")
    .replace(/&#8211;/g, "–")
    .replace(/\s+/g, " ")
    .trim();
}

function createReadableRepositoryName(name = "") {
  return name
    .replaceAll("-", " ")
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    );
}

function normalizeLocalizedText(value, language) {
  if (typeof value === "string") {
    return value;
  }

  if (value && typeof value === "object") {
    return (
      value[language] ||
      value.en ||
      value.tr ||
      ""
    );
  }

  return "";
}

async function getGitHubUpdates() {
  try {
    const response = await fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=pushed&direction=desc&per_page=20`,
      {
        headers: {
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28",
        },
        next: {
          revalidate: 1800,
        },
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      }
    );

    if (!response.ok) {
      console.warn(
        "GitHub updates could not be loaded:",
        response.status
      );

      return [];
    }

    const repositories = await response.json();

    return repositories
      .filter(
        (repository) =>
          !repository.fork &&
          !repository.archived &&
          repository.name !== GITHUB_USERNAME
      )
      .map((repository) =>
        createUpdate({
          id: `github-${repository.id}-${repository.pushed_at}`,
          platform: "github",
          action: "updated",
          title: createReadableRepositoryName(
            repository.name
          ),
          description:
            repository.description ||
            "A GitHub project received a new update.",
          date:
            repository.pushed_at ||
            repository.updated_at,
          url: repository.html_url,
        })
      );
  } catch (error) {
    console.warn(
      "GitHub updates could not be loaded:",
      error
    );

    return [];
  }
}

async function getMediumUpdates() {
  try {
    const response = await fetch(
      `https://medium.com/feed/@${MEDIUM_USERNAME}`,
      {
        headers: {
          Accept:
            "application/rss+xml, application/xml, text/xml",
          "User-Agent": "ZealCoder Portfolio",
        },
        next: {
          revalidate: 1800,
        },
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      }
    );

    if (!response.ok) {
      console.warn(
        "Medium updates could not be loaded:",
        response.status
      );

      return [];
    }

    const xml = await response.text();
    const parsedFeed = xmlParser.parse(xml);

    const rawItems =
      parsedFeed?.rss?.channel?.item || [];

    const items = Array.isArray(rawItems)
      ? rawItems
      : [rawItems];

    return items
      .slice(0, 20)
      .map((item, index) => {
        const rawDescription =
          item.description ||
          item["content:encoded"] ||
          "";

        const description =
          cleanText(rawDescription);

        return createUpdate({
          id:
            item.guid ||
            `medium-${index}-${item.pubDate || item.link}`,
          platform: "medium",
          action: "published",
          title:
            item.title ||
            "New Medium article",
          description:
            description.slice(0, 220) ||
            "A new article was published on Medium.",
          date:
            item.pubDate ||
            item.isoDate ||
            new Date().toISOString(),
          url:
            item.link ||
            `https://medium.com/@${MEDIUM_USERNAME}`,
        });
      });
  } catch (error) {
    console.warn(
      "Medium updates could not be loaded:",
      error
    );

    return [];
  }
}

function getManualUpdates(language) {
  return manualUpdates.map((update) =>
    createUpdate({
      ...update,
      title: normalizeLocalizedText(
        update.title,
        language
      ),
      description: normalizeLocalizedText(
        update.description,
        language
      ),
    })
  );
}

export async function getAutomaticUpdates({
  limit = 6,
  language = "en",
} = {}) {
  const normalizedLanguage =
    language === "tr" ? "tr" : "en";

  const [
    githubUpdates,
    mediumUpdates,
  ] = await Promise.all([
    getGitHubUpdates(),
    getMediumUpdates(),
  ]);

  const combinedUpdates = [
    ...githubUpdates,
    ...mediumUpdates,
    ...getManualUpdates(normalizedLanguage),
  ];

  const uniqueUpdates = Array.from(
    new Map(
      combinedUpdates.map((update) => [
        update.id,
        update,
      ])
    ).values()
  );

  return uniqueUpdates
    .filter((update) => {
      const date = new Date(update.date);

      return (
        update.id &&
        update.title &&
        update.url &&
        !Number.isNaN(date.getTime())
      );
    })
    .sort(
      (firstUpdate, secondUpdate) =>
        new Date(secondUpdate.date).getTime() -
        new Date(firstUpdate.date).getTime()
    )
    .slice(0, limit);
}
