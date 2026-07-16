import { getCaseStudies, getProjects, getProjectBySlug } from "@/content";

export async function getProjectsPageData() {
  const [projects, caseStudies] = await Promise.all([getProjects(), Promise.resolve(getCaseStudies())]);
  const featuredGithubUrls = new Set(caseStudies.map((project) => project.links?.github).filter(Boolean));

  return {
    caseStudies: caseStudies.slice(0, 3),
    archiveProjects: projects.filter((project) => !featuredGithubUrls.has(project.githubUrl)),
  };
}

export async function getProjectDetailData(slug) {
  const project = await getProjectBySlug(slug);

  return {
    project,
    isCaseStudy: Boolean(project?.links),
  };
}
