'use server';

import { auth, signIn, signOut } from '@/auth';
import { redirect } from 'next/navigation';
import z from 'zod';
import {
  APIResponse,
  CheckoutItem,
  DetailPayment,
  Item,
  RegisterError,
} from './definitions';
import { baseUrl } from './data';
import { revalidatePath, revalidateTag } from 'next/cache';
import { encrypt } from './crypto';

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

const CartActionSchema = z.object({
  sku: z.string(),
  quantity: z.coerce.number(),
});

export type CartActionState = {
  status: 'iddle' | 'success' | 'error';
  message: string | null;
};

export async function addToCart(
  callbackUrl: string,
  sku: string,
  prevState: CartActionState,
  formData: FormData
): Promise<CartActionState> {
  const session = await auth();
  const params = new URLSearchParams();
  params.set('callbackUrl', callbackUrl);
  if (!session) redirect('/login?' + callbackUrl);
  const data = CartActionSchema.parse({
    sku,
    quantity: formData.get('quantity') as string,
  });
  try {
    const response = await fetch(`${baseUrl}/carts`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify(data),
    });
    const json = await response.json();

    if (json.code !== 200) {
      throw new Error(JSON.stringify(json));
    }
    return {
      status: 'success',
      message: 'Produk berhasil ditambahkan ke keranjang',
    };
  } catch (error) {
    if (error instanceof Error) {
      const json = JSON.parse(error.message) as APIResponse<
        { message: string },
        { message: string }
      >;
      return {
        status: 'error',
        message: json.errors.message,
      };
    }
    return {
      status: 'error',
      message: 'Something gone wrong!',
    };
  } finally {
    revalidateTag('cart');
  }
}

export async function redirectToSingleCheckout(data: CheckoutItem) {
  const ecryptedData = encrypt(data);
  const params = new URLSearchParams();
  params.set('token', ecryptedData);
  redirect(`/checkout?${params}`);
}

export async function singleCheckout(
  courierService: string,
  addressId: number,
  bank: string,
  items: Item[]
) {
  const session = await auth();
  if (!session) redirect('/login');
  const key = courierService.split('_');
  if (key.length !== 2) {
    // handle error invalid courier service
    throw new Error('Invalid courier service');
  }
  const response = await fetch(`${baseUrl}/checkout`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
    },
    body: JSON.stringify({
      courier_company: key[0],
      courier_type: key[1],
      address_id: addressId,
      bank,
      items,
    }),
  });
  const json = (await response.json()) as APIResponse<DetailPayment, any>;

  if (json.code !== 200) {
    throw new Error(JSON.stringify(json));
  }

  redirect(`/payment/${json.data.id}`);
}
