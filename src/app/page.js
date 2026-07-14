'use client';

import HomePageContent from "@/components/HomePageContent";
import { getGitHubProjects } from "@/lib/github";
import { getAutomaticUpdates } from "@/lib/updates/getAutomaticUpdates";

export const revalidate = 1800;

function createDashboardData(projects = []) {
  const languageCounts = projects.reduce(
    (counts, project) => {
      const language = project.language;
      if (!language) {
        return counts;
      }
      counts[language] = (counts[language] || 0) + 1;
      return counts;
    },
    {}
  );

  const projectsWithLanguage = Object.values(
    languageCounts
  ).reduce((total, count) => total + count, 0);

  const languages = Object.entries(languageCounts)
    .map(([name, count]) => ({
      name,
      count,
      percentage:
        projectsWithLanguage === 0
          ? 0
          : Math.round(
              (count / projectsWithLanguage) * 100
            ),
    }))
    .sort((first, second) => second.count - first.count);

  const latestProject =
    [...projects].sort((first, second) => {
      const firstDate = new Date(
        first.pushedAt || first.updatedAt || 0
      ).getTime();
      const secondDate = new Date(
        second.pushedAt || second.updatedAt || 0
      ).getTime();
      return secondDate - firstDate;
    })[0] || null;

  return {
    totalProjects: projects.length,
    featuredProjects: projects.filter(
      (project) => project.featured
    ).length,
    totalStars: projects.reduce(
      (total, project) =>
        total + Number(project.stars || 0),
      0
    ),
    languages,
    latestProject,
  };
}

export default async function Home() {
  const [projects, updates] = await Promise.all([
    getGitHubProjects(),
    getAutomaticUpdates({
      limit: 6,
    }),
  ]);

  const dashboardData =
    createDashboardData(projects);

  return (
    <HomePageContent
      dashboardData={dashboardData}
      updates={updates}
    />
  );
}