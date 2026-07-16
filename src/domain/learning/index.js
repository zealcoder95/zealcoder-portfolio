import { getCurrentLearning } from "@/content";

export function getLearningPageData() {
  return { skills: getCurrentLearning() };
}
