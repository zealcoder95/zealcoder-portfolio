import { findById } from "@/content/contracts/contentContracts";
import { githubProjectsRepository } from "@/content/repositories/githubProjectsRepository";
import { staticContentRepository } from "@/content/repositories/staticContentRepository";

export function getCaseStudies() {
  return staticContentRepository.getProjects();
}

export function getFeaturedProject() {
  return staticContentRepository.getFeaturedProject();
}

export async function getProjects() {
  return githubProjectsRepository.getProjects();
}

export async function getProjectBySlug(slug) {
  const caseStudy = findById(getCaseStudies(), slug);
  return caseStudy || githubProjectsRepository.getProjectBySlug(slug);
}
