import { staticContentRepository } from "@/content/repositories/staticContentRepository";

export function getLearning() {
  return staticContentRepository.getLearning();
}

export function getCurrentLearning() {
  return getLearning();
}
