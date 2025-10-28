import NextAuth, { type NextAuthOptions } from "next-auth"
import GitHubProvider from "next-auth/providers/github"
import Credentials from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import { compare } from "bcryptjs"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
      allowDangerousEmailAccountLinking: false,
    }),
    Credentials({
      name: "Email & Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        const user = await prisma.user.findUnique({ where: { email: credentials.email } })
        if (!user?.passwordHash) return null
        const ok = await compare(credentials.password, user.passwordHash)
        if (!ok) return null
        
        // 승인 전이면 로그인 거부
        if (user.status !== "ACTIVE" || !user.adminApproved) {
          return null
        }
        
        return { 
          id: user.id, 
          email: user.email, 
          name: user.name, 
          role: user.role, 
          status: user.status,
          adminApproved: user.adminApproved
        } as any
      },
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // @ts-ignore
        token.role = (user as any).role ?? "USER"
        // @ts-ignore
        token.status = (user as any).status ?? "PENDING"
        // @ts-ignore
        token.adminApproved = (user as any).adminApproved ?? false
      } else if (token?.email) {
        const db = await prisma.user.findUnique({ 
          where: { email: token.email as string }, 
          select: { role: true, status: true, adminApproved: true } 
        })
        if (db) {
          // @ts-ignore
          token.role = db.role
          // @ts-ignore
          token.status = db.status
          // @ts-ignore
          token.adminApproved = db.adminApproved
        }
      }
      return token
    },
    async session({ session, token }) {
      // @ts-ignore
      session.user.role = token.role ?? "USER"
      // @ts-ignore
      session.user.status = token.status ?? "PENDING"
      // @ts-ignore
      session.user.adminApproved = token.adminApproved ?? false
      return session
    },
  },
  pages: {
    signIn: "/auth/signin", // 커스텀 로그인 페이지
  }
}

export default NextAuth(authOptions)
