import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = createSupabaseServerClient();

    const { data, error } = await supabase
      .from("updates")
      .select("*")
      .eq("is_visible", true)
      .order("published_at", {
        ascending: false,
      })
      .limit(50);

    if (error) {
      console.error("Supabase updates error:", error);

      return NextResponse.json(
        {
          updates: [],
          error: "Updates could not be loaded.",
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json({
      updates: data || [],
    });
  } catch (error) {
    console.error("Updates API error:", error);

    return NextResponse.json(
      {
        updates: [],
        error: "Updates service is unavailable.",
      },
      {
        status: 500,
      }
    );
  }
}