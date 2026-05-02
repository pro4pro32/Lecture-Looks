import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { isProtectedPath } from "@/lib/auth";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const user = await updateSession(request, response);

  if (!user && isProtectedPath(pathname)) {
    const signInUrl = request.nextUrl.clone();
    signInUrl.pathname = "/auth";
    signInUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(signInUrl);
  }

  if (user && pathname === "/auth") {
    const feedUrl = request.nextUrl.clone();
    feedUrl.pathname = "/feed";
    return NextResponse.redirect(feedUrl);
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
