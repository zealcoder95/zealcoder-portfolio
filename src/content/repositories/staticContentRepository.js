import { aiLab } from "@/data/aiLab";
import { certificates } from "@/data/certificates";
import { content } from "@/data/content";
import { projects } from "@/data/projects";
import { resources } from "@/data/resources";
import { skills } from "@/data/skills";

const HOMEPAGE_FEATURED_PROJECT_ID = "renewable-energy";

const timeline = [
  { id: "engineering-foundation", year: "2022", title: { en: "Engineering Foundation", tr: "Mühendislik Temeli" }, description: { en: "Developed analytical thinking, problem-solving and engineering discipline.", tr: "Analitik düşünme, problem çözme ve mühendislik disiplini geliştirdim." } },
  { id: "python-sql", year: "2023", title: { en: "Python & SQL", tr: "Python ve SQL" }, description: { en: "Started building programming and database foundations through practical exercises.", tr: "Uygulamalı çalışmalarla programlama ve veritabanı temellerimi oluşturmaya başladım." } },
  { id: "data-analytics", year: "2024", title: { en: "Data Analytics", tr: "Veri Analitiği" }, description: { en: "Worked with data cleaning, visualization, Power BI and analytical storytelling.", tr: "Veri temizleme, görselleştirme, Power BI ve analitik hikâyeleştirme üzerine çalıştım." } },
  { id: "data-science-machine-learning", year: "2025", title: { en: "Data Science & Machine Learning", tr: "Veri Bilimi ve Makine Öğrenmesi" }, description: { en: "Built project-based experience with exploratory analysis and machine learning workflows.", tr: "Keşifsel veri analizi ve makine öğrenmesi süreçleriyle proje tabanlı deneyim geliştirdim." } },
  { id: "ai-engineering-journey", year: "2026", title: { en: "AI Engineering Journey", tr: "AI Engineering Yolculuğu" }, description: { en: "Focusing on LLMs, RAG systems, AI agents and production-ready intelligent applications.", tr: "LLM, RAG sistemleri, AI agentları ve üretime hazır akıllı uygulamalara odaklanıyorum." } },
];

const socialLinks = [
  { id: "github", platform: "github", label: "GitHub", handle: "github.com/zealcoder95", url: "https://github.com/zealcoder95", visibility: "public", sortOrder: 10 },
  { id: "medium", platform: "medium", label: "Medium", handle: "medium.com/@zealcoder", url: "https://medium.com/@zealcoder", visibility: "public", sortOrder: 20 },
  { id: "kaggle", platform: "kaggle", label: "Kaggle", handle: "kaggle.com/gizemglc", url: "https://www.kaggle.com/gizemglc", visibility: "public", sortOrder: 30 },
  { id: "linkedin", platform: "linkedin", label: "LinkedIn", handle: "linkedin.com/in/gizemgulcu", url: "https://www.linkedin.com/in/gizemgulcu", visibility: "public", sortOrder: 40 },
  { id: "email", platform: "email", label: "Email", handle: "gizemgulcu95@gmail.com", url: "mailto:gizemgulcu95@gmail.com", visibility: "contact-only", sortOrder: 50 },
];

const navigation = [
  { id: "about", href: "/about", label: { en: "About", tr: "Hakkımda" } },
  { id: "projects", href: "/projects", label: { en: "Projects", tr: "Projeler" } },
  { id: "learning", href: "/learning", label: { en: "Learning Hub", tr: "Learning Hub" } },
  { id: "certificates", href: "/certificates", label: { en: "Certificates", tr: "Sertifikalar" } },
  { id: "ai-lab", href: "/ai-lab", label: { en: "AI Lab", tr: "AI Lab" } },
  { id: "resume", href: "/resume", label: { en: "Resume", tr: "Özgeçmiş" } },
  { id: "contact", href: "/contact", label: { en: "Contact", tr: "İletişim" } },
];

export const staticContentRepository = {
  getProjects: () => projects,
  getFeaturedProject: () => projects.find((project) => project.id === HOMEPAGE_FEATURED_PROJECT_ID) || null,
  getResources: () => resources,
  getLearning: () => skills,
  getCertificates: () => certificates,
  getAiLab: () => aiLab,
  getTimeline: () => timeline,
  getSocialLinks: () => socialLinks,
  getNavigation: () => navigation,
  getUiCopy: (locale) => content[locale === "tr" ? "tr" : "en"] || content.en,
};
