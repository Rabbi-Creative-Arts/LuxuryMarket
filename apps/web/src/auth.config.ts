import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";

export default {
  providers: [
    Credentials({
      name: "Credentials",

      credentials: {
        email: {
          label: "Email",
          type: "email",
        },

        password: {
          label: "Password",
          type: "password",
        },
      },

      async authorize() {
        /**
         * Middleware runs in the Edge Runtime.
         * Never access Prisma here.
         * Authentication happens in auth.ts.
         */
        return null;
      },
    }),
  ],

  pages: {
    signIn: "/login",
  },

  session: {
    strategy: "jwt",
  },

  callbacks: {
    authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user;

      const protectedRoutes = [
        "/dashboard",
        "/vendor",
        "/account",
        "/admin",
      ];

      const isProtected = protectedRoutes.some((route) =>
        request.nextUrl.pathname.startsWith(route)
      );

      if (isProtected && !isLoggedIn) {
        return false;
      }

      return true;
    },
  },
} satisfies NextAuthConfig;
