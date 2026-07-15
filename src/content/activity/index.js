import { activityRepository } from "@/content/repositories/activityRepository";

export async function getActivityFeed(options) {
  return activityRepository.getActivityFeed(options);
}
