import { getArticles } from "@/content";

export function getArticlePageData() {
  return { articles: getArticles() };
}
