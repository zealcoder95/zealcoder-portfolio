import {
  findRelevantProjects,
  mostPopularProject,
  newestProject,
  normalize,
} from "@/lib/ai/search";

function isTurkish(question = "") {
  const normalized = normalize(question);

  return (
    /[çğıöşü]/i.test(question) ||
    /\b(kim|hangi|nedir|proje|projeler|yetenek|beceri|neden|özgeçmiş|işe|güncel|yeni|yenisi|bunlardan)\b/.test(
      normalized
    )
  );
}

function formatDate(value, locale = "en-GB") {
  if (!value) return "Unknown";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Unknown";
  }

  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

function formatProject(project, turkish = false) {
  const locale = turkish ? "tr-TR" : "en-GB";

  return [
    `${turkish ? "Proje" : "Project"}: ${project.title}`,

    project.summary
      ? `${turkish ? "Özet" : "Summary"}: ${project.summary}`
      : null,

    project.language
      ? `${turkish ? "Dil" : "Language"}: ${project.language}`
      : null,

    project.tags?.length
      ? `${turkish ? "Etiketler" : "Tags"}: ${project.tags.join(", ")}`
      : null,

    `${turkish ? "Son güncelleme" : "Last updated"}: ${formatDate(
      project.pushedAt || project.updatedAt,
      locale
    )}`,

    `Stars: ${project.stars || 0}`,

    project.githubUrl
      ? `GitHub: ${project.githubUrl}`
      : null,

    project.kaggleUrl
      ? `Kaggle: ${project.kaggleUrl}`
      : null,
  ]
    .filter(Boolean)
    .join("\n");
}

export function buildFallbackAnswer({
  message,
  projects,
  history,
}) {
  const q = normalize(message);
  const turkish = isTurkish(message);

  const relevant = findRelevantProjects(
    projects,
    message,
    history
  );

  const asksRecruiterQuestion =
    q.includes("neden gizem") ||
    q.includes("neden işe") ||
    q.includes("işe almal") ||
    q.includes("beni neden işe almalısınız") ||
    q.includes("neden seni işe") ||
    q.includes("why should i hire") ||
    q.includes("why hire") ||
    q.includes("recruiter") ||
    q.includes("candidate") ||
    q.includes("hire gizem") ||
    q.includes("aday olarak");

  if (asksRecruiterQuestion) {
    const highlightedProjects = projects
      .filter((project) => project.featured)
      .slice(0, 3);

    const selectedProjects =
      highlightedProjects.length > 0
        ? highlightedProjects
        : projects.slice(0, 3);

    const technologies = Array.from(
      new Set(
        projects.flatMap((project) => [
          project.language,
          ...(project.tags || []),
        ])
      )
    )
      .filter(Boolean)
      .slice(0, 12);

    const projectEvidence = selectedProjects
      .map((project) => {
        return [
          `• ${project.title}`,
          project.summary
            ? `  ${project.summary}`
            : null,
          project.githubUrl
            ? `  GitHub: ${project.githubUrl}`
            : null,
        ]
          .filter(Boolean)
          .join("\n");
      })
      .join("\n\n");

    return turkish
      ? `Gizem Gülcü'yü değerlendirirken portfolyosunda görülen güçlü yönler:

• Elektrik-Elektronik Mühendisliği altyapısı
• Python, SQL, veri analizi ve yapay zekâ projeleri geliştirmesi
• Gerçek veri setleriyle uçtan uca analizler yapması
• GitHub README dokümantasyonuna önem vermesi
• Öğrenme sürecini düzenli olarak projelere dönüştürmesi
• Kendi Gemini destekli AI portfolyo platformunu geliştirmiş olması

Portfolyoda kullanılan başlıca teknolojiler:

${technologies.map((item) => `• ${item}`).join("\n")}

İncelenmesi önerilen projeler:

${projectEvidence}

Bu değerlendirme yalnızca mevcut GitHub ve portfolyo verilerine dayanmaktadır.`
      : `Based on the available portfolio, Gizem Gülcü demonstrates:

• An engineering background in Electrical and Electronics Engineering
• Practical experience with Python, SQL, data analysis, and artificial intelligence
• End-to-end projects using real-world datasets
• A strong habit of documenting work through GitHub README files
• The ability to turn continuous learning into practical projects
• The ability to build and maintain this Gemini-powered AI portfolio platform

Main technologies visible in the portfolio:

${technologies.map((item) => `• ${item}`).join("\n")}

Recommended projects to review:

${projectEvidence}

This evaluation is based only on the available GitHub repositories and portfolio data.`;
  }

  const asksNewest =
    q.includes("en güncel") ||
    q.includes("en yeni") ||
    q.includes("yenisi") ||
    q.includes("newest") ||
    q.includes("latest") ||
    q.includes("most recent");

  if (asksNewest) {
    const project = newestProject(relevant);

    if (!project) {
      return turkish
        ? "İlgili projeler arasında güncellik bilgisi bulamadım."
        : "I could not find update information for the relevant projects.";
    }

    return turkish
      ? `Bu konuşmada geçen projeler arasında en güncel olan proje:\n\n${formatProject(
          project,
          true
        )}`
      : `The newest project among the projects discussed is:\n\n${formatProject(
          project,
          false
        )}`;
  }

  const asksPopular =
    q.includes("en popüler") ||
    q.includes("most popular") ||
    q.includes("en çok yıldız") ||
    q.includes("most starred");

  if (asksPopular) {
    const project = mostPopularProject(relevant);

    if (!project) {
      return turkish
        ? "İlgili projeler arasında popülerlik bilgisi bulamadım."
        : "I could not find popularity data for the relevant projects.";
    }

    return turkish
      ? `İlgili projeler arasında GitHub yıldızlarına göre öne çıkan proje:\n\n${formatProject(
          project,
          true
        )}`
      : `The most popular relevant project by GitHub stars is:\n\n${formatProject(
          project,
          false
        )}`;
  }

  if (
    q.includes("kim") ||
    q.includes("gizem") ||
    q.includes("who is")
  ) {
    return turkish
      ? "Gizem Gülcü, ZealCoder kişisel teknoloji platformunu geliştiren; veri bilimi, makine öğrenmesi ve yapay zekâ mühendisliği alanlarına odaklanan bir geliştiricidir."
      : "Gizem Gülcü is the creator of ZealCoder and focuses on data science, machine learning, and AI engineering.";
  }

  if (
    q.includes("skill") ||
    q.includes("yetenek") ||
    q.includes("beceri") ||
    q.includes("tech stack") ||
    q.includes("teknoloji")
  ) {
    const technologies = Array.from(
      new Set(
        projects.flatMap((project) => [
          project.language,
          ...(project.tags || []),
        ])
      )
    ).filter(Boolean);

    return turkish
      ? `Portfolyo verilerine göre öne çıkan teknolojiler:\n\n${technologies
          .slice(0, 15)
          .map((item) => `• ${item}`)
          .join("\n")}`
      : `Based on the portfolio, the main technologies include:\n\n${technologies
          .slice(0, 15)
          .map((item) => `• ${item}`)
          .join("\n")}`;
  }

  if (
    q.includes("project") ||
    q.includes("proje") ||
    q.includes("python") ||
    q.includes("sql") ||
    q.includes("machine learning") ||
    q.includes("ai") ||
    q.includes("power bi")
  ) {
    return turkish
      ? `Sorunuzla en ilgili görünen projeler:\n\n${relevant
          .slice(0, 4)
          .map((project) =>
            formatProject(project, true)
          )
          .join("\n\n---\n\n")}`
      : `The projects most relevant to your question are:\n\n${relevant
          .slice(0, 4)
          .map((project) =>
            formatProject(project, false)
          )
          .join("\n\n---\n\n")}`;
  }

  return turkish
    ? "Projeler, kullanılan teknolojiler, GitHub çalışmaları ve Gizem’in profili hakkında sorular sorabilirsiniz."
    : "You can ask about Gizem’s projects, technologies, GitHub work, and professional direction.";
}