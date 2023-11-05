import type { NextAuthConfig } from 'next-auth';
import { NextURL } from 'next/dist/server/web/next-url';

function handleAuth(
  isAuthenticated: () => boolean,
  nextUrl: NextURL
): boolean | Response {
  if (!isAuthenticated()) {
    nextUrl.searchParams.set('callbackUrl', nextUrl.href);
    nextUrl.pathname = '/login';
    return Response.redirect(nextUrl);
  }
  return true;
}

export const authConfig = {
  providers: [],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async authorized({ auth, request: { nextUrl } }) {
      const pathname = nextUrl.pathname;
      if (!!auth?.user) {
        if (pathname === '/login' || pathname === '/register') {
          return Response.redirect(new URL('/', nextUrl));
        }
      }
      return handleAuth(() => {
        if (pathname.startsWith('/dashboard')) {
          return auth?.user.role === 'owner' || auth?.user.role === 'admin';
        }

        // pages for customer
        if (
          pathname.startsWith('/settings') ||
          pathname === '/my-orders' ||
          pathname === '/order'
        ) {
          return auth?.user.role === 'customer';
        }
        return true;
      }, nextUrl);
    },
    async jwt({ token, user }) {
      if (user) {
        return {
          ...token,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
          role: user.role,
        };
      }
      return {
        ...token,
      };
    },
    async session({ session, token }) {
      if (token.role) session.user.role = token.role;
      return {
        ...session,
        accessToken: token.accessToken,
        refreshToken: token.refreshToken,
      };
    },
  },
} satisfies NextAuthConfig;
