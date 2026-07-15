import { getFeaturedExperiments } from "@/content/aiLab";
import { getLatestArticles } from "@/content/articles";
import { getFeaturedProject } from "@/content/projects";
import { getFeaturedResources } from "@/content/resources";

export function getHomepageContent() {
  return {
    featuredProject: getFeaturedProject(),
    articles: getLatestArticles(),
    resources: getFeaturedResources(),
    experiments: getFeaturedExperiments(),
  };
}
