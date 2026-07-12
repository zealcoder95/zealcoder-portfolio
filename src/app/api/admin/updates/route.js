import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

const ALLOWED_PLATFORMS = [
  "github",
  "medium",
  "kaggle",
  "linkedin",
  "resource",
  "certificate",
  "website",
];

const ALLOWED_ACTIONS = [
  "published",
  "updated",
  "added",
  "removed",
  "shared",
];

function normalizeText(value) {
  return typeof value === "string" ? value.trim() : "";
}

function isValidUrl(value) {
  if (value.startsWith("/")) {
    return true;
  }

  try {
    const parsedUrl = new URL(value);

    return (
      parsedUrl.protocol === "https:" ||
      parsedUrl.protocol === "http:"
    );
  } catch {
    return false;
  }
}

async function getAuthorizedAdmin() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  const adminEmail = normalizeText(
    process.env.ADMIN_EMAIL
  ).toLocaleLowerCase("en");

  const userEmail = normalizeText(
    user.email
  ).toLocaleLowerCase("en");

  if (!adminEmail || userEmail !== adminEmail) {
    return null;
  }

  return user;
}

export async function GET() {
  try {
    const user = await getAuthorizedAdmin();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized.",
        },
        {
          status: 401,
        }
      );
    }

    const supabase = createSupabaseAdminClient();

    const { data, error } = await supabase
      .from("updates")
      .select("*")
      .order("published_at", {
        ascending: false,
      })
      .limit(100);

    if (error) {
      console.error(
        "Admin updates read error:",
        error
      );

      return NextResponse.json(
        {
          success: false,
          updates: [],
          error: "Updates could not be loaded.",
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json({
      success: true,
      updates: data || [],
    });
  } catch (error) {
    console.error(
      "Admin updates GET error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        updates: [],
        error: "Admin service is unavailable.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(request) {
  try {
    const user = await getAuthorizedAdmin();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Your admin session is missing or unauthorized.",
        },
        {
          status: 401,
        }
      );
    }

    const body = await request.json();

    const platform = normalizeText(body.platform);
    const action = normalizeText(body.action);
    const titleEn = normalizeText(body.titleEn);
    const titleTr = normalizeText(body.titleTr);
    const descriptionEn = normalizeText(
      body.descriptionEn
    );
    const descriptionTr = normalizeText(
      body.descriptionTr
    );
    const url = normalizeText(body.url);
    const publishedAt = normalizeText(
      body.publishedAt
    );

    if (!ALLOWED_PLATFORMS.includes(platform)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid platform.",
        },
        {
          status: 400,
        }
      );
    }

    if (!ALLOWED_ACTIONS.includes(action)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid action.",
        },
        {
          status: 400,
        }
      );
    }

    if (!titleEn || !titleTr) {
      return NextResponse.json(
        {
          success: false,
          error:
            "English and Turkish titles are required.",
        },
        {
          status: 400,
        }
      );
    }

    if (!url || !isValidUrl(url)) {
      return NextResponse.json(
        {
          success: false,
          error: "A valid URL is required.",
        },
        {
          status: 400,
        }
      );
    }

    const publicationDate = publishedAt
      ? new Date(publishedAt)
      : new Date();

    if (
      Number.isNaN(publicationDate.getTime())
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid publication date.",
        },
        {
          status: 400,
        }
      );
    }

    const supabase = createSupabaseAdminClient();

    const { data, error } = await supabase
      .from("updates")
      .insert({
        platform,
        action,
        title_en: titleEn,
        title_tr: titleTr,
        description_en:
          descriptionEn || null,
        description_tr:
          descriptionTr || null,
        url,
        published_at:
          publicationDate.toISOString(),
        is_visible: true,
      })
      .select()
      .single();

    if (error) {
      console.error(
        "Admin update insert error:",
        error
      );

      return NextResponse.json(
        {
          success: false,
          error: "Update could not be published.",
        },
        {
          status: 500,
        }
      );
    }

    revalidatePath("/");
    revalidatePath("/updates");
    revalidatePath("/admin");

    return NextResponse.json(
      {
        success: true,
        update: data,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "Admin updates POST error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error: "Admin service is unavailable.",
      },
      {
        status: 500,
      }
    );
  }
}