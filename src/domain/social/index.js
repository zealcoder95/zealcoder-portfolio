import { getNavigation, getSocialLinks } from "@/content";

export function getSiteChromeData(locale) {
  const language = locale === "tr" ? "tr" : "en";
  return {
    navigation: getNavigation(language),
    footerLinks: [
      { href: "/projects", label: language === "tr" ? "Projeler" : "Projects" },
      { href: "/resources", label: language === "tr" ? "Kaynaklar" : "Resources" },
      { href: "/resume", label: language === "tr" ? "Özgeçmiş" : "Resume" },
      { href: "/contact", label: language === "tr" ? "İletişim" : "Contact" },
    ],
    socialLinks: getSocialLinks(),
  };
}

export function getContactPageData() {
  const socialLinks = getSocialLinks({ visibility: "all" });
  return { socialLinks, emailLink: socialLinks.find((item) => item.platform === "email") || null };
}
