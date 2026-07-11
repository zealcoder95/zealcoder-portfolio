import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

export async function updateSession(request) {
  let response = NextResponse.next({
    request,
  });

  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL;

  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Supabase environment variables are missing."
    );
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },

        setAll(cookiesToSet) {
          cookiesToSet.forEach(
            ({ name, value }) => {
              request.cookies.set(name, value);
            }
          );

          response = NextResponse.next({
            request,
          });

          cookiesToSet.forEach(
            ({ name, value, options }) => {
              response.cookies.set(
                name,
                value,
                options
              );
            }
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const isAdminRoute =
    pathname.startsWith("/admin");
  const isLoginRoute =
    pathname === "/admin/login";

  if (
    isAdminRoute &&
    !isLoginRoute &&
    !user
  ) {
    const loginUrl =
      request.nextUrl.clone();

    loginUrl.pathname = "/admin/login";
    loginUrl.searchParams.set(
      "next",
      pathname
    );

    return NextResponse.redirect(loginUrl);
  }

  if (isLoginRoute && user) {
    const adminUrl =
      request.nextUrl.clone();

    adminUrl.pathname = "/admin";
    adminUrl.search = "";

    return NextResponse.redirect(adminUrl);
  }

  return response;
}