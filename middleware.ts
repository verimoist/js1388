import { withAuth } from "next-auth/middleware"

export default withAuth({
  callbacks: {
    authorized: ({ token, req }) => {
      const isAdmin = req.nextUrl.pathname.startsWith("/admin")
      if (!isAdmin) return true
      
      // @ts-ignore
      const ok = token && 
        token.role === "ADMIN" && 
        token.adminApproved === true && 
        token.status === "ACTIVE"
      
      return !!ok
    }
  }
})

export const config = { matcher: ["/admin/:path*"] }
