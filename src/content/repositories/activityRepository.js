import { getAutomaticUpdates } from "@/lib/updates/getAutomaticUpdates";

export const activityRepository = {
  getActivityFeed: async (options) => {
    try {
      return await getAutomaticUpdates(options);
    } catch (error) {
      console.error("Content activity query failed:", error);
      return [];
    }
  },
};
