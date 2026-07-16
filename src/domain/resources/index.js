import { getResources } from "@/content";

export function getResourcesPageData() {
  return { resources: getResources() };
}
