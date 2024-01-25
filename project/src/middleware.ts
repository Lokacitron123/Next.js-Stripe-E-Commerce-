import { withAuth, NextRequestWithAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(request: NextRequestWithAuth) {
    if (
      request.nextUrl.pathname.startsWith("/dashboard") &&
      request.nextauth.token?.role !== "admin"
    ) {
      return NextResponse.rewrite(new URL("/denied", request.url));
    }

    if (
      request.nextUrl.pathname.startsWith("/userdashboard") &&
      request.nextauth.token?.role !== "admin" &&
      request.nextauth.token?.role !== "user"
    ) {
      return NextResponse.rewrite(new URL("/denied", request.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = { matcher: ["/dashboard/:path*", "/userdashboard"] };

// Docs
// Ref: https://next-auth.js.org/configuration/nextjs#advanced-usage
// Ref: https://nextjs.org/docs/app/building-your-application/routing/middleware#matche
