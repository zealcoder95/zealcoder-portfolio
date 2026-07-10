const BASE_URL = "https://zealcoder.vercel.app";

export default function sitemap() {
  const routes = [
    "",
    "/about",
    "/projects",
    "/learning",
    "/ai-lab",
    "/resources",
    "/certificates",
    "/contact",
  ];

  return routes.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "/projects" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.8,
  }));
}