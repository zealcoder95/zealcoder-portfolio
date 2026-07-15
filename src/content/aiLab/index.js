import { staticContentRepository } from "@/content/repositories/staticContentRepository";

export function getAiLabExperiments() {
  return staticContentRepository.getAiLab();
}

export function getFeaturedExperiments(limit = 3) {
  return getAiLabExperiments().slice(0, Math.max(0, limit));
}
