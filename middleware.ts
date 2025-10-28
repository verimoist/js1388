import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ token, req }) => {
      const p = req.nextUrl.pathname;
      if (p.startsWith("/admin")) {
        return token?.role === "ADMIN";
      }
      // 로그인 자체는 approved 유저만 허용(NextAuth authorize에서 필터됨)
      return true;
    },
  },
});

export const config = { matcher: ["/admin/:path*"] };
