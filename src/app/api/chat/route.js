import { NextResponse } from "next/server";
import { getGitHubProjects } from "@/lib/github";
import { buildFallbackAnswer } from "@/lib/ai/fallback";
import { generateGeminiAnswer } from "@/lib/ai/gemini";
import {
  findRelevantProjects,
  removeNonPortfolioProfiles,
} from "@/lib/ai/search";
import { buildGeminiPrompt } from "@/lib/ai/prompt";

const ROUTE_VERSION = "zealcoder-ai-v5";

export async function POST(request) {
  try {
    const body = await request.json();
    const message = body?.message?.trim();

    const history = Array.isArray(body?.history)
      ? body.history
          .filter(
            (item) =>
              item &&
              ["user", "assistant"].includes(item.role) &&
              typeof item.text === "string"
          )
          .slice(-10)
      : [];

    if (!message) {
      return NextResponse.json(
        {
          error: "A message is required.",
          version: ROUTE_VERSION,
        },
        {
          status: 400,
        }
      );
    }

    const loadedProjects = await getGitHubProjects();

    const projects =
      removeNonPortfolioProfiles(loadedProjects);

    const relevantProjects = findRelevantProjects(
      projects,
      message,
      history
    );

    const fallbackAnswer = buildFallbackAnswer({
      message,
      projects,
      history,
    });

    console.log("ZEALCODER CHAT", {
      version: ROUTE_VERSION,
      message,
      historyLength: history.length,
      loadedProjectCount: loadedProjects.length,
      filteredProjectCount: projects.length,
      relevantSlugs: relevantProjects.map(
        (project) => project.slug
      ),
    });

    const prompt = buildGeminiPrompt({
      message,
      history,
      projects: relevantProjects,
    });

    try {
      const answer =
        await generateGeminiAnswer(prompt);

      return NextResponse.json({
        answer: answer || fallbackAnswer,
        mode: answer ? "gemini" : "local",
        version: ROUTE_VERSION,
      });
    } catch (error) {
      console.error(
        "Gemini fallback activated:",
        error
      );

      return NextResponse.json({
        answer: fallbackAnswer,
        mode: "local",
        version: ROUTE_VERSION,
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
          "The assistant is temporarily unavailable.",
        version: ROUTE_VERSION,
      },
      {
        status: 500,
      }
    );
  }
}