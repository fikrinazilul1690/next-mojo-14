import type { NextAuthConfig } from "next-auth";
import { NextResponse } from "next/server";
import { APIResponse, RefreshedToken } from "./app/lib/definitions";

function isAuthenticated(pathname: string, role?: string): boolean {
  if (pathname.startsWith("/dashboard")) {
    return role === "owner" || role === "admin";
  }

  // pages for customer
  if (
    pathname.startsWith("/payment") ||
    pathname.startsWith("/orders") ||
    pathname.startsWith("/addresses") ||
    pathname.startsWith("/checkout") ||
    pathname === "/cart" ||
    pathname === "/wishlist"
  ) {
    return role === "customer";
  }
  if (pathname.startsWith("/settings")) {
    return !!role;
  }
  return true;
}

const baseUrl = "https://toko-mojopahit-production.up.railway.app/v1";

async function refreshAccessToken(
  refreshToken: string,
): Promise<RefreshedToken> {
  const res = await fetch(`${baseUrl}/auth/renew-access`, {
    method: "POST",
    body: JSON.stringify({
      refresh_token: refreshToken,
    }),
  });
  const json = (await res.json()) as APIResponse<
    RefreshedToken,
    { message: string }
  >;

  if (!res.ok) {
    throw new Error(json.errors.message);
  }

  return json.data;
}

export const authConfig = {
  providers: [],
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async authorized({ auth, request }) {
      // console.log("authorized callbacks");
      const { nextUrl } = request;
      const { pathname } = nextUrl;
      const isLoggedIn = !!auth?.user;

      let callbackUrl = nextUrl.pathname;
      if (nextUrl.search) {
        callbackUrl += nextUrl.search;
      }

      const encodedCallbackUrl = encodeURIComponent(callbackUrl);

      console.log("middleware called at:", pathname);

      if (!isAuthenticated(pathname, auth?.user.role)) {
        return Response.redirect(
          new URL(`/login?callbackUrl=${encodedCallbackUrl}`, nextUrl),
        );
      }

      if (isLoggedIn) {
        if (pathname === "/login" || pathname === "/register") {
          return Response.redirect(new URL("/", nextUrl));
        }

        // Given an incoming request...
        const newHeaders = new Headers(request.headers);
        // Add a new header
        newHeaders.set("Authorization", `Bearer ${auth.accessToken}`);
        // And produce a response with the new headers
        return NextResponse.next({
          request: {
            // New request headers
            headers: newHeaders,
          },
        });
      }

      return true;
    },
    async jwt({ token, user }) {
      // console.log("jwt callbacks");
      if (user) {
        return {
          ...token,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
          role: user.role,
          accessTokenExpiresAt: user.accessTokenExpiresAt,
        };
      }
      return {
        ...token,
      };
    },
    async session({ session, token }) {
      // console.log("session callback");
      if (token.role) session.user.role = token.role;
      return {
        ...session,
        accessToken: token.accessToken,
        refreshToken: token.refreshToken,
        accessTokenExpiresAt: token.accessTokenExpiresAt,
      };
    },
  },
} satisfies NextAuthConfig;
