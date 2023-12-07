import NextAuth, { type DefaultSession } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import { baseUrl } from './app/lib/data';
import { z } from 'zod';
import type { APIResponse, LoginResponse } from '@/app/lib/definitions';

async function login({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<LoginResponse | undefined> {
  const res = await fetch(`${baseUrl}/auth/login`, {
    method: 'POST',
    body: JSON.stringify({
      email,
      password,
    }),
  });
  const json = (await res.json()) as APIResponse<
    LoginResponse,
    { message: string }
  >;
  if (json.code === 401) {
    return undefined;
  }
  if (json.code !== 200) {
    throw new Error(json.errors.message);
  }
  return json.data;
}

export const {
  auth,
  signIn,
  signOut,
  handlers: { GET, POST },
} = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const data = await login({ email, password });
          if (!data) return null;
          return {
            id: data.user.id,
            email: data.user.email,
            name: data.user.name,
            role: data.user.role,
            accessToken: data.access_token,
            refreshToken: data.refresh_token,
            image: data.user.profile_picture?.url,
          };
        }

        return null;
      },
    }),
  ],
});
