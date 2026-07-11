import HomePageContent from "@/components/HomePageContent";
import { getGitHubProjects } from "@/lib/github";
import { getAutomaticUpdates } from "@/lib/updates/getAutomaticUpdates";

export const revalidate = 1800;

export default async function Home() {
  const [projects, updates] = await Promise.all([
    getGitHubProjects(),
    getAutomaticUpdates({
      limit: 6,
    }),
  ]);

  const languageCounts = projects.reduce(
  (accumulator, project) => {
    const language = project.language;

    if (!language) {
      return accumulator;
    }

    accumulator[language] =
      (accumulator[language] || 0) + 1;

    return accumulator;
  },
  {}
);

const languages = Object.entries(languageCounts)
  .map(([name, count]) => ({
    name,
    count,
  }))
  .sort((a, b) => b.count - a.count);

const dashboardData = {
  totalProjects: projects.length,

  featuredProjects: projects.filter(
    (project) => project.featured
  ).length,

  totalStars: projects.reduce(
    (total, project) =>
      total + (project.stars || 0),
    0
  ),

  languages,

  latestProject:
    [...projects].sort(
      (a, b) =>
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
    )[0] || null,
};

  return (
    <HomePageContent
      dashboardData={dashboardData}
      updates={updates}
    />
  );
}