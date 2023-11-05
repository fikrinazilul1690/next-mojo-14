'use server';

import { auth, signIn, signOut } from '@/auth';
import { redirect } from 'next/navigation';
import z from 'zod';
import { APIResponse, RegisterError } from './definitions';
import { baseUrl } from './data';
import { revalidatePath } from 'next/cache';

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export type LoginState = {
  errors?: {
    email?: string[];
    password?: string[];
  };
  message?: string | null;
};

export async function authenticate(
  redirectTo: string,
  prevState: LoginState,
  formData: FormData
) {
  const validatedFields = LoginSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email, password } = validatedFields.data;

  try {
    await signIn('credentials', {
      email,
      password,
      redirect: false,
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('CredentialsSignin')) {
        return {
          message: 'Invalid credentials',
        };
      }
      if (error.message.includes('CallbackRouteError')) {
        return {
          message: 'Something wrong',
        };
      }
    }
  }

  redirect(redirectTo);
}

const RegisterSchema = z
  .object({
    name: z.string().min(3),
    email: z.string().email(),
    phone: z.string().regex(/^(\+62|62|0)8[1-9][0-9]{6,9}$/, {
      message: 'Invalid phone number',
    }),
    password: z.string().min(8),
    confirm_password: z.string(),
  })
  .refine((schema) => schema.password === schema.confirm_password, {
    message: 'Confirm password not match',
    path: ['confirm_password'],
  });

export type RegisterState = {
  errors?: RegisterError;
  message?: string | null;
};

export async function register(prevState: RegisterState, formData: FormData) {
  const validatedFields = RegisterSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  console.log('register run...');

  try {
    const response = await fetch(`${baseUrl}/auth/register`, {
      method: 'POST',
      body: JSON.stringify({ ...validatedFields.data }),
    });

    const data = (await response.json()) as APIResponse<
      { message: string },
      RegisterError
    >;

    if (!response.ok) {
      throw data.errors;
    }

    console.log('response: ', response);
  } catch (error) {
    console.log('error :', error);
    const registerError = error as RegisterError;
    if (registerError.message) {
      return {
        message: registerError.message,
      };
    }
    return {
      errors: {
        name: registerError.name,
        email: registerError.email,
        phone: registerError.phone,
        password: registerError.password,
        confirm_password: registerError.confirm_password,
      },
    };
  }

  redirect('/login');
}

export async function logout() {
  await signOut();
}

export async function toogleWishlist(
  callbackUrl: string,
  isExist: boolean,
  sku: string
) {
  const session = await auth();
  const params = new URLSearchParams();
  params.set('callbackUrl', callbackUrl);
  if (!session) redirect('/login?' + callbackUrl);
  try {
    if (isExist) {
      const response = await fetch(`${baseUrl}/wishlist/${sku}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      });
      const json = await response.json();

      if (!response.ok) {
        throw new Error(JSON.stringify(json));
      }
    } else {
      const response = await fetch(`${baseUrl}/wishlist`, {
        method: 'POST',
        body: JSON.stringify({ sku }),
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      });

      const json = await response.json();

      if (!response.ok) {
        throw new Error(JSON.stringify(json));
      }
    }
  } catch (error) {
    console.log(error);
  } finally {
    revalidatePath('wishlist');
  }
}
