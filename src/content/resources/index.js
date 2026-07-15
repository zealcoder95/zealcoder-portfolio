import { staticContentRepository } from "@/content/repositories/staticContentRepository";

export function getResources() {
  return staticContentRepository.getResources();
}

export function getFeaturedResources(limit = 6) {
  return getResources().slice(0, Math.max(0, limit));
}
