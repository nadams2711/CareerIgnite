import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./prisma";
import authConfig from "./auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/",
  },
  callbacks: {
    async jwt({ token, user, trigger }) {
      if (user) {
        token.id = user.id as string;
      }
      if (user || trigger === "update") {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: {
            role: true,
            adminSchoolId: true,
            adminSchool: { select: { code: true } },
          },
        });
        if (dbUser) {
          token.role = dbUser.role;
          token.adminSchoolId = dbUser.adminSchoolId;
          token.adminSchoolCode = dbUser.adminSchool?.code ?? null;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.id) {
        session.user.id = token.id as string;
        session.user.role = token.role;
        session.user.adminSchoolId = token.adminSchoolId;
        session.user.adminSchoolCode = token.adminSchoolCode;
      }
      return session;
    },
  },
});
