import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ token, req }) => {
      // /admin 이하만 ADMIN 허용
      if (req.nextUrl.pathname.startsWith("/admin")) {
        return token?.role === "ADMIN";
      }
      return true;
    },
  },
});

export const config = { matcher: ["/admin/:path*"] };
