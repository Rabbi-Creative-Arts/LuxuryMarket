import NextAuth from "next-auth";
import authConfig from "@/auth.config";

const { auth } = NextAuth(authConfig);

export default auth;

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/account/:path*",
    "/vendor/:path*",
    "/admin/:path*",
  ],
};
