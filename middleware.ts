import { withAuth } from "next-auth/middleware"

export default withAuth({
  callbacks: {
    authorized: ({ token, req }) => {
      const isAdminRoute = req.nextUrl.pathname.startsWith("/admin")
      if (!isAdminRoute) return true
      // @ts-ignore
      return token?.role === "ADMIN"
    },
  },
})

export const config = { matcher: ["/admin/:path*"] }
