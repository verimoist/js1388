import NextAuth, { type NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    CredentialsProvider({
      name: "Email & Password",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("[AUTH] authorize start", credentials?.email);
        
        if (!credentials?.email || !credentials?.password) return null;
        const user = await prisma.user.findUnique({ where: { email: credentials.email } });
        if (!user) return null;

        const hash = (user as any).passwordHash;
        if (!hash) return null;

        const ok = await bcrypt.compare(credentials.password, hash);
        console.log("[AUTH] bcrypt result", ok);
        
        if (!ok) return null;

        // 관리자 승인/권한 체크
        const approved = (user as any).adminApproved ?? false;
        const role = (user as any).role ?? "USER";
        console.log("[AUTH] user role/approved", role, approved);
        
        if (!approved || role !== "ADMIN") {
          // 승인되지 않은 계정은 거부
          return null;
        }

        return {
          id: user.id,
          name: user.name ?? "",
          email: user.email,
          role: (user as any).role,
        } as any;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.role = (user as any).role ?? token.role ?? "USER";
      }
      return token;
    },
    async session({ session, token }: any) {
      (session.user as any).role = token.role ?? "USER";
      return session;
    },
    async signIn({ user, account }: any) {
      // GitHub 로 로그인하는 경우에도 ADMIN+승인만 허용
      if (account?.provider === "github") {
        const u = await prisma.user.findUnique({ where: { email: user.email! } });
        if (!u) return false;
        const approved = (u as any).adminApproved ?? false;
        const role = (u as any).role ?? "USER";
        return approved && role === "ADMIN";
      }
      return true;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/signin",
  },
};

export default NextAuth(authOptions);
