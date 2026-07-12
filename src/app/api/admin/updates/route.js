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
  return typeof value === "string"
    ? value.trim()
    : "";
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
  const supabase =
    await createSupabaseServerClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  const configuredAdminEmail = normalizeText(
    process.env.ADMIN_EMAIL
  ).toLowerCase();

  const userEmail = normalizeText(
    user.email
  ).toLowerCase();

  if (
    !configuredAdminEmail ||
    userEmail !== configuredAdminEmail
  ) {
    return null;
  }

  return user;
}

function revalidateUpdatePages() {
  revalidatePath("/");
  revalidatePath("/updates");
  revalidatePath("/admin");
  revalidatePath("/admin/new");
  revalidatePath("/admin/updates");
}

export async function POST(request) {
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

    const body = await request.json();

    const platform = normalizeText(
      body.platform
    );

    const action = normalizeText(
      body.action
    );

    const titleEn = normalizeText(
      body.titleEn
    );

    const titleTr = normalizeText(
      body.titleTr
    );

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

    if (
      !ALLOWED_PLATFORMS.includes(platform)
    ) {
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
            "İngilizce ve Türkçe başlık zorunludur.",
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
          error: "Geçerli bir URL gereklidir.",
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
      Number.isNaN(
        publicationDate.getTime()
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Geçersiz yayın tarihi.",
        },
        {
          status: 400,
        }
      );
    }

    const adminClient =
      createSupabaseAdminClient();

    const { data, error } =
      await adminClient
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
          error:
            "Güncelleme yayımlanamadı.",
        },
        {
          status: 500,
        }
      );
    }

    revalidateUpdatePages();

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
        error:
          "Admin servisine ulaşılamadı.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function PATCH(request) {
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

    const body = await request.json();
    const id = normalizeText(body.id);

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Güncelleme kimliği gereklidir.",
        },
        {
          status: 400,
        }
      );
    }

    const adminClient =
      createSupabaseAdminClient();

    /*
     * Yalnızca görünürlüğü değiştiren istek:
     * { id, isVisible }
     */
    if (
      typeof body.isVisible === "boolean"
    ) {
      const { data, error } =
        await adminClient
          .from("updates")
          .update({
            is_visible: body.isVisible,
            updated_at:
              new Date().toISOString(),
          })
          .eq("id", id)
          .select()
          .single();

      if (error) {
        console.error(
          "Visibility update error:",
          error
        );

        return NextResponse.json(
          {
            success: false,
            error:
              "Görünürlük değiştirilemedi.",
          },
          {
            status: 500,
          }
        );
      }

      revalidateUpdatePages();

      return NextResponse.json({
        success: true,
        update: data,
      });
    }

    /*
     * İçeriği düzenleyen istek:
     * { id, platform, action, titleEn, ... }
     */
    const platform = normalizeText(
      body.platform
    );

    const action = normalizeText(
      body.action
    );

    const titleEn = normalizeText(
      body.titleEn
    );

    const titleTr = normalizeText(
      body.titleTr
    );

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

    if (
      !ALLOWED_PLATFORMS.includes(platform)
    ) {
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
            "İngilizce ve Türkçe başlık zorunludur.",
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
          error: "Geçerli bir URL gereklidir.",
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
      Number.isNaN(
        publicationDate.getTime()
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Geçersiz yayın tarihi.",
        },
        {
          status: 400,
        }
      );
    }

    const { data, error } =
      await adminClient
        .from("updates")
        .update({
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
          updated_at:
            new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

    if (error) {
      console.error(
        "Content update error:",
        error
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "Değişiklikler kaydedilemedi.",
        },
        {
          status: 500,
        }
      );
    }

    revalidateUpdatePages();

    return NextResponse.json({
      success: true,
      update: data,
    });
  } catch (error) {
    console.error(
      "Admin updates PATCH error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Admin servisine ulaşılamadı.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(request) {
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

    const body = await request.json();
    const id = normalizeText(body.id);

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Güncelleme kimliği gereklidir.",
        },
        {
          status: 400,
        }
      );
    }

    const adminClient =
      createSupabaseAdminClient();

    const { error } = await adminClient
      .from("updates")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(
        "Admin update delete error:",
        error
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "Güncelleme silinemedi.",
        },
        {
          status: 500,
        }
      );
    }

    revalidateUpdatePages();

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(
      "Admin updates DELETE error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Admin servisine ulaşılamadı.",
      },
      {
        status: 500,
      }
    );
  }
}