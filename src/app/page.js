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