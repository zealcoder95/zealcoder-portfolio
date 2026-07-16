import {
  getFeaturedProject,
  getFeaturedResources,
  getFeaturedExperiments,
  getLatestArticles,
  getSocialLinks,
} from "@/content";

const copy = {
  en: {
    hero: { eyebrow: "Gizem Gülcü · AI Engineering Journey", title: "Building toward AI Engineering, one real project at a time.", journey: "From Electrical & Electronics Engineering to programming, data, machine learning and AI Engineering—ZealCoder documents the work, questions and lessons along the way.", profilesLabel: "Follow the work", projectsLabel: "View Projects", learningLabel: "Learning Journey", continueLabel: "Explore current focus" },
    hub: { focus: "Current Focus", focusTitle: "A platform built in public, through practical work.", featured: "Featured Project", featuredTitle: "One question, a careful analysis.", problem: "Problem", impact: "What it delivers", caseStudy: "View Case Study", journey: "Learning Journey", journeyTitle: "A direction, not a finished story.", writing: "Latest Writing", writingTitle: "Technical writing is taking shape.", writingText: "Notes and articles about data, machine learning and AI Engineering will be shared on Medium as the work develops.", topic: "Topic", reading: "Reading time", writingStatus: "Writing in progress", medium: "Visit Medium", resources: "Resources", resourcesTitle: "Useful references for the next step.", resourcesText: "A small, practical library for building stronger foundations.", open: "Open resource", lab: "AI Lab", labTitle: "A home for experiments worth documenting.", labText: "This space will collect LLM notes, RAG experiments and agent workflows as they become real, reviewable work.", comingSoon: "Coming Soon", exploreLab: "Explore AI Lab", together: "Let's Build Together", togetherTitle: "Open to thoughtful conversations and practical collaboration.", togetherText: "Whether you are hiring, building, learning or exploring, ZealCoder is a place to start a useful conversation.", contact: "Contact", github: "Visit GitHub", allProjects: "All projects", allResources: "All resources", learningLink: "Explore the learning journey", stages: [["Completed", "Python, SQL, Pandas and data analysis foundations."], ["Current", "Machine learning, project documentation and AI Engineering foundations."], ["Next", "Deep learning, LLMs, RAG systems and AI agents."]] },
  },
  tr: {
    hero: { eyebrow: "Gizem Gülcü · AI Engineering Yolculuğu", title: "AI Engineering yolunda, gerçek projelerle ilerliyorum.", journey: "Elektrik-Elektronik Mühendisliğinden programlama, veri, makine öğrenmesi ve AI Engineering'e uzanan bu yolculuk; yapılan çalışmaları, soruları ve öğrenilenleri belgeliyor.", profilesLabel: "Çalışmaları takip et", projectsLabel: "Projeleri Gör", learningLabel: "Öğrenme Yolculuğu", continueLabel: "Mevcut odağı keşfet" },
    hub: { focus: "Mevcut Odak", focusTitle: "Uygulamalı çalışmalarla, açıkça geliştirilen bir platform.", featured: "Öne Çıkan Proje", featuredTitle: "Bir soru, dikkatli bir analiz.", problem: "Problem", impact: "Sunduğu değer", caseStudy: "Vaka Çalışmasını Gör", journey: "Öğrenme Yolculuğu", journeyTitle: "Tamamlanmış bir hikâye değil, net bir yön.", writing: "Son Yazılar", writingTitle: "Teknik yazılar şekilleniyor.", writingText: "Çalışmalar geliştikçe veri, makine öğrenmesi ve AI Engineering üzerine notlar ve yazılar Medium'da paylaşılacak.", topic: "Konu", reading: "Okuma süresi", writingStatus: "Yazım aşamasında", medium: "Medium'u ziyaret et", resources: "Kaynaklar", resourcesTitle: "Sonraki adım için faydalı referanslar.", resourcesText: "Daha güçlü temeller kurmak için küçük ve uygulamalı bir kütüphane.", open: "Kaynağı aç", lab: "AI Lab", labTitle: "Belgelenmeye değer deneyler için bir alan.", labText: "Bu alan, gerçek ve incelenebilir hâle geldikçe LLM notlarını, RAG deneylerini ve agent iş akışlarını bir araya getirecek.", comingSoon: "Yakında", exploreLab: "AI Lab'i keşfet", together: "Birlikte Üretelim", togetherTitle: "Düşünülmüş sohbetlere ve uygulamalı iş birliklerine açığım.", togetherText: "İster işe alım, ister üretim, ister öğrenme veya keşif için burada olun; ZealCoder faydalı bir sohbetin başlangıç noktasıdır.", contact: "İletişime Geç", github: "GitHub'ı ziyaret et", allProjects: "Tüm projeler", allResources: "Tüm kaynaklar", learningLink: "Öğrenme yolculuğunu incele", stages: [["Tamamlanan", "Python, SQL, Pandas ve veri analizi temelleri."], ["Mevcut", "Makine öğrenmesi, proje dokümantasyonu ve AI Engineering temelleri."], ["Sıradaki", "Derin öğrenme, LLM'ler, RAG sistemleri ve AI agent'lar."]] },
  },
};

export function getHomepageData(locale) {
  const language = locale === "tr" ? "tr" : "en";
  const text = copy[language];
  const localize = (value) => (value && typeof value === "object" ? value[language] || value.en || value.tr : value);
  const project = getFeaturedProject();
  const featuredProject = project && { ...project, title: localize(project.title), category: localize(project.category), problem: localize(project.problem), outcome: localize(project.outcome) };
  const socialLinks = getSocialLinks();
  const medium = socialLinks.find((link) => link.platform === "medium");
  const github = socialLinks.find((link) => link.platform === "github");

  return {
    hero: { ...text.hero, profiles: socialLinks.filter((link) => link.platform !== "email") },
    currentFocus: [
      { title: text.hub.stages[1][0], description: text.hub.stages[1][1], href: "/learning" },
      { title: language === "tr" ? "Şu anda geliştiriliyor" : "Currently building", description: language === "tr" ? "Uygulamalı bir AI öğrenme platformu." : "A practical AI learning platform.", href: "/ai-lab" },
      featuredProject ? { title: language === "tr" ? "Son proje" : "Latest project", description: featuredProject.title[language], href: `/projects/${featuredProject.id}` } : null,
      { title: language === "tr" ? "Son yazılar" : "Latest writing", description: language === "tr" ? "Medium'da teknik notlar hazırlanıyor." : "Technical notes are in progress on Medium.", href: medium?.url || "/updates", external: Boolean(medium) },
    ].filter(Boolean),
    featuredProject,
    learningPreview: text.hub.stages.map(([stage, description]) => ({ stage, description })),
    latestWriting: { articles: getLatestArticles(), href: medium?.url || "/updates", platform: medium?.label || "Medium" },
    resourcesPreview: getFeaturedResources().map((resource) => ({ ...resource, type: localize(resource.type), description: localize(resource.description) })),
    aiLabPreview: getFeaturedExperiments().map((experiment) => ({ ...experiment, status: localize(experiment.status), description: localize(experiment.description) })),
    cta: { contactHref: "/contact", githubHref: github?.url || "/projects" },
    copy: text.hub,
  };
}
