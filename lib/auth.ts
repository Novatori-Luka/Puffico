import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    authorized({ auth, request }) {
      const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");
      const isLoginPage = request.nextUrl.pathname === "/admin/login";

      if (isAdminRoute && !isLoginPage) {
        return !!auth?.user;
      }
      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          const admin = await prisma.adminUser.findUnique({
            where: { email: credentials.email as string },
          });

          if (!admin) return null;

          const isValid = await compare(
            credentials.password as string,
            admin.password
          );

          if (!isValid) return null;

          return { id: admin.id, email: admin.email, name: admin.name ?? admin.email };
        } catch {
          // DB not connected — allow dev credentials as fallback
          const DEV_EMAIL = "admin@puffico.ge";
          const DEV_PASSWORD = "Puffico2025!";
          if (
            credentials.email === DEV_EMAIL &&
            credentials.password === DEV_PASSWORD
          ) {
            return { id: "dev", email: DEV_EMAIL, name: "Puffico Admin" };
          }
          return null;
        }
      },
    }),
  ],
});
