import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

function normalizeText(value) {
  return typeof value === "string" ? value.trim() : "";
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
  revalidatePath("/admin/updates");
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
          error: "Update id is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (typeof body.isVisible !== "boolean") {
      return NextResponse.json(
        {
          success: false,
          error: "isVisible must be a boolean.",
        },
        {
          status: 400,
        }
      );
    }

    const adminClient =
      createSupabaseAdminClient();

    const { data, error } = await adminClient
      .from("updates")
      .update({
        is_visible: body.isVisible,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error(
        "Admin update visibility error:",
        error
      );

      return NextResponse.json(
        {
          success: false,
          error: "Update visibility could not be changed.",
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
        error: "Admin service is unavailable.",
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
          error: "Update id is required.",
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
          error: "Update could not be deleted.",
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
        error: "Admin service is unavailable.",
      },
      {
        status: 500,
      }
    );
  }
}