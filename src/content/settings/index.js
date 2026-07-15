import { staticContentRepository } from "@/content/repositories/staticContentRepository";

export function getUiCopy(locale) {
  return staticContentRepository.getUiCopy(locale);
}

export function getSocialLinks({ visibility = "public" } = {}) {
  return staticContentRepository
    .getSocialLinks()
    .filter((link) => visibility === "all" || link.visibility === visibility)
    .sort((first, second) => first.sortOrder - second.sortOrder);
}

export function getNavigation(locale) {
  const normalizedLocale = locale === "tr" ? "tr" : "en";

  return staticContentRepository.getNavigation().map((item) => ({
    ...item,
    label: item.label[normalizedLocale] || item.label.en,
  }));
}
