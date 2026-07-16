import { getTimeline } from "@/content";

export function getTimelinePageData() {
  return { timeline: getTimeline() };
}
