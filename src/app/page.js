import { getGitHubProjects } from "@/lib/github";
import HomePageContent from "@/components/HomePageContent";

export default async function Home() {
  let projects = [];

  try {
    projects = await getGitHubProjects();
  } catch (error) {
    console.error("Dashboard data could not be loaded:", error);
  }

  const languageCounts = projects.reduce((acc, project) => {
    if (!project.language) return acc;

    acc[project.language] = (acc[project.language] || 0) + 1;
    return acc;
  }, {});

  const totalLanguages = Object.values(languageCounts).reduce(
    (total, count) => total + count,
    0
  );

  const languages = Object.entries(languageCounts)
    .map(([name, count]) => ({
      name,
      count,
      percentage:
        totalLanguages === 0
          ? 0
          : Math.round((count / totalLanguages) * 100),
    }))
    .sort((a, b) => b.count - a.count);

  const dashboardData = {
    repositories: projects.length,
    portfolioProjects: projects.length,
    featuredProjects: projects.filter((project) => project.featured).length,
    totalStars: projects.reduce(
      (total, project) => total + (project.stars || 0),
      0
    ),
    languages,
  };

  return <HomePageContent dashboardData={dashboardData} />;
}