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
        return ok ? { id: user.id, email: user.email, name: user.name, role: user.role } as any : null
      },
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // @ts-ignore
        token.role = (user as any).role ?? token.role ?? "USER"
      } else {
        // 갱신 시 DB에서 role 동기화
        if (token?.email) {
          const u = await prisma.user.findUnique({ where: { email: token.email as string }, select: { role: true } })
          if (u?.role) token.role = u.role
        }
      }
      return token
    },
    async session({ session, token }) {
      // @ts-ignore
      session.user.role = token.role ?? "USER"
      return session
    },
  },
  pages: {
    signIn: "/auth/signin", // 커스텀 로그인 페이지
  }
}

export default NextAuth(authOptions)
