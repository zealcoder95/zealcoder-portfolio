import {
  getGitHubProject,
  getGitHubProjects,
} from "@/lib/github";

export const githubProjectsRepository = {
  getProjects: async () => {
    try {
      return await getGitHubProjects();
    } catch (error) {
      console.error("Content GitHub project query failed:", error);
      return [];
    }
  },
  getProjectBySlug: async (slug) => {
    try {
      return await getGitHubProject(slug);
    } catch (error) {
      console.error("Content GitHub project query failed:", error);
      return null;
    }
  },
};
