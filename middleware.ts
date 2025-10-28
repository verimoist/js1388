import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token: any = (req as any).nextauth?.token;

    // 1) 공개/허용 경로: 절대 차단 금지
    if (
      pathname.startsWith("/api/auth") ||
      pathname.startsWith("/auth") ||
      pathname === "/" ||
      pathname.startsWith("/api/migrate") ||
      pathname.startsWith("/gallery") ||
      pathname.startsWith("/news") ||
      pathname.startsWith("/press") ||
      pathname.startsWith("/resources") ||
      pathname.startsWith("/about") ||
      pathname.startsWith("/contact") ||
      pathname.startsWith("/programs") ||
      pathname.startsWith("/privacy") ||
      pathname.startsWith("/terms")
    ) {
      return NextResponse.next();
    }

    // 2) /admin 보호
    if (pathname.startsWith("/admin")) {
      if (!token) {
        // 비로그인 → 로그인 페이지
        const url = req.nextUrl.clone();
        url.pathname = "/auth/signin";
        return NextResponse.redirect(url);
      }
      // 로그인 했지만 승인/권한 부족
      if (!(token.role === "ADMIN")) {
        const url = req.nextUrl.clone();
        url.pathname = "/auth/pending";
        return NextResponse.redirect(url);
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: () => true, // 실제 판정은 위에서 수행
    },
  }
);

export const config = {
  matcher: ["/admin/:path*", "/auth/:path*", "/api/:path*","/((?!_next|static).*)"],
};
