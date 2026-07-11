import { NextResponse } from "next/server";

import { getGitHubProjects } from "@/lib/github";
import { buildFallbackAnswer } from "@/lib/ai/fallback";
import { generateGeminiAnswer } from "@/lib/ai/gemini";
import {
  findRelevantProjects,
  removeNonPortfolioProfiles,
} from "@/lib/ai/search";
import { buildGeminiPrompt } from "@/lib/ai/prompt";
import { retrieveProjectEvidence } from "@/lib/ai/retrieval";
import { buildProjectPrompt } from "@/lib/ai/projectPrompt";

const ROUTE_VERSION =
  "zealcoder-ai-v5.5-language";

function normalizeQuestion(value = "") {
  return String(value)
    .toLocaleLowerCase("tr")
    .replace(/[.,!?;:()[\]{}"'`]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function detectLanguage(message = "") {
  const normalized =
    normalizeQuestion(message);

  const turkishWords =
    /\b(bana|benim|bunlar|bunlardan|göster|gösterir|hangi|hangisi|hakkında|işe|neden|nedir|proje|projeler|uygun|yetenek|beceri|güncel|yeni|kullanılan|teknolojiler)\b/;

  return (
    /[çğıöşü]/i.test(message) ||
    turkishWords.test(normalized)
  )
    ? "tr"
    : "en";
}

function isRecruiterQuestion(
  message = ""
) {
  const question =
    normalizeQuestion(message);

  return (
    question.includes(
      "why should i hire"
    ) ||
    question.includes("why hire") ||
    question.includes("hire gizem") ||
    question.includes("fit a junior") ||
    question.includes("fit this role") ||
    question.includes("candidate") ||
    question.includes("recruiter") ||
    question.includes(
      "evaluate gizem"
    ) ||
    question.includes("review gizem") ||
    question.includes(
      "neden işe almal"
    ) ||
    question.includes(
      "gizemi neden"
    ) ||
    question.includes(
      "gizem i neden"
    ) ||
    question.includes(
      "bu role uygun"
    ) ||
    question.includes(
      "aday olarak"
    ) ||
    question.includes(
      "güçlü yönleri"
    ) ||
    question.includes(
      "geliştirmesi gereken"
    )
  );
}

function isProjectQuestion(
  message = ""
) {
  const question =
    normalizeQuestion(message);

  return (
    question.includes("project") ||
    question.includes("projects") ||
    question.includes("proje") ||
    question.includes("projeler") ||
    question.includes("sql") ||
    question.includes("python") ||
    question.includes("power bi") ||
    question.includes(
      "machine learning"
    ) ||
    question.includes("github") ||
    question.includes("kaggle") ||
    question.includes("newest") ||
    question.includes("latest") ||
    question.includes("en güncel") ||
    question.includes("en yeni") ||
    question.includes("which one") ||
    question.includes("hangisi")
  );
}

function selectRecruiterProjects(
  projects = []
) {
  const featuredProjects =
    projects.filter(
      (project) => project.featured
    );

  const selectedProjects =
    featuredProjects.length >= 2
      ? featuredProjects
      : projects;

  return selectedProjects.slice(0, 4);
}

function serializeProjects(
  projects = []
) {
  return projects.map((project) => ({
    id: project.id,
    slug: project.slug,
    title: project.title,
    summary: project.summary,
    category: project.category,

    technologies:
      project.technologies || [],

    skills:
      project.skills || [],

    featured:
      project.featured === true,

    cover:
      project.cover || null,

    githubUrl:
      project.githubUrl || null,

    kaggleUrl:
      project.kaggleUrl || null,

    homepage:
      project.homepage || null,

    stars:
      project.stars || 0,

    updatedAt:
      project.pushedAt ||
      project.updatedAt ||
      null,
  }));
}

export async function POST(request) {
  let responseLanguage = "en";

  try {
    const body =
      await request.json();

    const message =
      body?.message?.trim();

    const history =
      Array.isArray(body?.history)
        ? body.history
            .filter(
              (item) =>
                item &&
                [
                  "user",
                  "assistant",
                ].includes(
                  item.role
                ) &&
                typeof item.text ===
                  "string"
            )
            .slice(-10)
        : [];

    if (!message) {
      return NextResponse.json(
        {
          error:
            "A message is required.",
          language:
            responseLanguage,
          version:
            ROUTE_VERSION,
        },
        {
          status: 400,
        }
      );
    }

    responseLanguage =
      detectLanguage(message);

    const loadedProjects =
      await getGitHubProjects();

    const projects =
      removeNonPortfolioProfiles(
        loadedProjects
      );

    const recruiterQuestion =
      isRecruiterQuestion(message);

    const projectQuestion =
      !recruiterQuestion &&
      isProjectQuestion(message);

    const relevantProjects =
      recruiterQuestion
        ? selectRecruiterProjects(
            projects
          )
        : findRelevantProjects(
            projects,
            message,
            history
          );

    const evidenceProjects =
      retrieveProjectEvidence({
        projects:
          relevantProjects,
        message,
        history,
        maxProjects:
          recruiterQuestion
            ? 4
            : 3,
        chunksPerProject: 2,
      });

    const projectCards =
      serializeProjects(
        evidenceProjects
      );

    const fallbackAnswer =
      buildFallbackAnswer({
        message,
        projects,
        history,
      });

    console.log(
      "ZEALCODER CHAT",
      {
        version:
          ROUTE_VERSION,

        message,
        responseLanguage,
        recruiterQuestion,
        projectQuestion,

        historyLength:
          history.length,

        loadedProjectCount:
          loadedProjects.length,

        filteredProjectCount:
          projects.length,

        relevantSlugs:
          relevantProjects.map(
            (project) =>
              project.slug
          ),

        evidenceProjects:
          evidenceProjects.map(
            (project) => ({
              slug:
                project.slug,

              retrievalScore:
                project.retrievalScore,

              headings:
                (
                  project.evidence ||
                  []
                ).map(
                  (item) =>
                    item.heading
                ),
            })
          ),
      }
    );

    const prompt =
      projectQuestion
        ? buildProjectPrompt({
            message,
            history,
            projects:
              evidenceProjects,
          })
        : buildGeminiPrompt({
            message,
            history,
            projects:
              evidenceProjects,
          });

    try {
      const result =
        await generateGeminiAnswer(
          prompt
        );

      if (result?.answer) {
        console.log(
          "ZEALCODER AI PROVIDER",
          {
            provider:
              result.provider,

            model:
              result.model,
          }
        );

        return NextResponse.json({
          answer:
            result.answer,

          projects:
            projectCards,

          language:
            responseLanguage,

          mode: "ai",

          provider:
            result.provider,

          model:
            result.model,

          version:
            ROUTE_VERSION,
        });
      }

      console.warn(
        "All Gemini models failed. Local fallback activated."
      );

      return NextResponse.json({
        answer:
          fallbackAnswer,

        projects:
          projectCards,

        language:
          responseLanguage,

        mode: "local",
        provider: "local",
        model: null,

        version:
          ROUTE_VERSION,
      });
    } catch (error) {
      console.error(
        "Gemini fallback activated:",
        error
      );

      return NextResponse.json({
        answer:
          fallbackAnswer,

        projects:
          projectCards,

        language:
          responseLanguage,

        mode: "local",
        provider: "local",
        model: null,

        version:
          ROUTE_VERSION,
      });
    }
  } catch (error) {
    console.error(
      "ZealCoder chat route error:",
      error
    );

    return NextResponse.json(
      {
        error:
          responseLanguage === "tr"
            ? "Asistan geçici olarak kullanılamıyor."
            : "The assistant is temporarily unavailable.",

        language:
          responseLanguage,

        version:
          ROUTE_VERSION,
      },
      {
        status: 500,
      }
    );
  }
}