import { staticContentRepository } from "@/content/repositories/staticContentRepository";

export function getTimeline() {
  return staticContentRepository.getTimeline();
}

export function getTimelinePreview(limit = 5) {
  return getTimeline().slice(0, Math.max(0, limit));
}
