'use server';

import { auth, signIn, signOut } from '@/auth';
import { redirect } from 'next/navigation';
import z, { Schema } from 'zod';
import {
  APIResponse,
  ChangePasswordError,
  CheckoutItem,
  CreateAddressError,
  CustomerAddress,
  DetailPayment,
  Item,
  Location,
  RegisterError,
  UpdateProfileError,
  UploadResponse,
  User,
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

export async function addToCartFromWishlist(
  prevState: CartActionState,
  formData: FormData
): Promise<CartActionState> {
  const session = await auth();
  const data = CartActionSchema.parse({
    sku: formData.get('sku') as string,
    quantity: formData.get('quantity') as string,
  });
  try {
    const response = await fetch(`${baseUrl}/carts`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${session?.accessToken}`,
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
  console.log('checkout run...');
  console.log({
    courier_company: key[0],
    courier_type: key[1],
    address_id: addressId,
    bank,
    items,
  });
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
  console.log(json);
  if (json.code !== 200) {
    throw new Error(JSON.stringify(json));
  }

  revalidateTag('payment');
  redirect(`/payment/${json.data.id}`);
}

export async function cartCheckout(
  courierService: string,
  addressId: number,
  bank: string,
  items: Item[]
) {
  const list_skus = items.map<string>((item) => item.sku);
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

  await fetch(`${baseUrl}/carts/bulk-delete`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
    },
    body: JSON.stringify({
      list_skus,
    }),
  });

  revalidateTag('payment-cart');

  redirect(`/payment/${json.data.id}`);
}

export async function cancelCheckout(paymentId: string) {
  const session = await auth();
  if (!session) redirect('/login');

  const response = await fetch(`${baseUrl}/payments/${paymentId}/cancel`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
    },
  });
  const json = (await response.json()) as APIResponse<DetailPayment, any>;

  if (json.code !== 200) {
    throw new Error(JSON.stringify(json));
  }

  revalidateTag('payment');
}

const CreateAddressSchema = z.object({
  contact_name: z.string().min(3),
  contact_phone: z.string().regex(/^(\+62|62|0)8[1-9][0-9]{6,9}$/, {
    message: 'Invalid phone number',
  }),
  full_address: z.string().min(5),
  note: z.string().optional(),
  is_primary: z
    .string()
    .optional()
    .transform((value) => value === 'true'),
});

const LocationSchema = z.object(
  {
    area_id: z.string(),
    province: z.string(),
    city: z.string(),
    district: z.string(),
    postal_code: z.string(),
  },
  { required_error: 'Location is required' }
);

export type CreateAddressState = {
  data?: null | CustomerAddress;
  errors?: CreateAddressError;
  message?: string | null;
};

export async function createAddress(
  location: Location | null,
  prevState: CreateAddressState,
  formData: FormData
): Promise<CreateAddressState> {
  let out = prevState;
  const validatedFields = CreateAddressSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  const validatedLocation = LocationSchema.safeParse(location ?? undefined);

  if (!validatedFields.success) {
    out = {
      data: null,
      errors: {
        ...validatedFields.error.flatten().fieldErrors,
      },
    };

    if (!validatedLocation.success) {
      out = {
        data: out.data,
        errors: {
          ...out.errors,
          location: validatedLocation.error.flatten().formErrors,
        },
      };
    }

    return out;
  }

  const session = await auth();
  if (!session) {
    return {
      data: null,
      message: 'authorization header is not provided',
    };
  }

  try {
    const response = await fetch(`${baseUrl}/users/addresses`, {
      method: 'POST',
      body: JSON.stringify({ ...validatedFields.data, ...location }),
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    });

    const json = (await response.json()) as APIResponse<
      CustomerAddress,
      CreateAddressError
    >;

    if (!response.ok) {
      throw json.errors;
    }
    out = {
      data: json.data,
    };
  } catch (error) {
    const createAddressErr = error as CreateAddressError;
    if (createAddressErr.message) {
      out = {
        data: null,
        message: createAddressErr.message,
      };
    }
    out = {
      data: null,
      errors: {
        contact_name: createAddressErr.contact_name,
        contact_phone: createAddressErr.contact_phone,
        full_address: createAddressErr.full_address,
        area_id: createAddressErr.area_id,
        province: createAddressErr.province,
        city: createAddressErr.city,
        district: createAddressErr.district,
        postal_code: createAddressErr.postal_code,
        note: createAddressErr.note,
        is_primary: createAddressErr.is_primary,
      },
    };
  } finally {
    revalidateTag('address');
    return out;
  }
}

const UpdateAddressSchema = CreateAddressSchema.omit({ is_primary: true });

export async function updateAddress(
  addressId: number,
  location: Location | null,
  prevState: CreateAddressState,
  formData: FormData
): Promise<CreateAddressState> {
  let out = prevState;
  const validatedFields = UpdateAddressSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  const validatedLocation = LocationSchema.safeParse(location ?? undefined);

  if (!validatedFields.success) {
    out = {
      data: null,
      errors: {
        ...validatedFields.error.flatten().fieldErrors,
      },
    };

    if (!validatedLocation.success) {
      console.log(validatedLocation.error.flatten().formErrors);
      out = {
        data: out.data,
        errors: {
          ...out.errors,
          location: validatedLocation.error.flatten().formErrors,
        },
      };
    }

    return out;
  }

  const session = await auth();
  if (!session) {
    return {
      data: null,
      message: 'authorization header is not provided',
    };
  }

  try {
    const response = await fetch(`${baseUrl}/users/addresses/${addressId}`, {
      method: 'PATCH',
      body: JSON.stringify({ ...validatedFields.data, ...location }),
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    });

    console.log(response);

    const json = (await response.json()) as APIResponse<
      CustomerAddress,
      CreateAddressError
    >;

    if (!response.ok) {
      throw json.errors;
    }
    out = {
      data: json.data,
    };
  } catch (error) {
    console.log('error :', error);
    const createAddressErr = error as CreateAddressError;
    if (createAddressErr.message) {
      out = {
        data: null,
        message: createAddressErr.message,
      };
    }
    out = {
      data: null,
      errors: {
        contact_name: createAddressErr.contact_name,
        contact_phone: createAddressErr.contact_phone,
        full_address: createAddressErr.full_address,
        area_id: createAddressErr.area_id,
        province: createAddressErr.province,
        city: createAddressErr.city,
        district: createAddressErr.district,
        postal_code: createAddressErr.postal_code,
        note: createAddressErr.note,
        is_primary: createAddressErr.is_primary,
      },
    };
  } finally {
    revalidateTag('address');
    return out;
  }
}

export async function deleteAddress(addressId: number) {
  const session = await auth();

  const response = await fetch(`${baseUrl}/users/addresses/${addressId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${session?.accessToken}`,
    },
  });

  const json = (await response.json()) as APIResponse<
    CustomerAddress,
    CreateAddressError
  >;

  if (!response.ok) {
    throw new Error(JSON.stringify(json));
  }
  revalidateTag('address');
}

export async function selectPrimaryAddress(addressId: number) {
  const session = await auth();

  const response = await fetch(
    `${baseUrl}/users/addresses/${addressId}/primary`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${session?.accessToken}`,
      },
    }
  );

  const json = (await response.json()) as APIResponse<
    CustomerAddress,
    CreateAddressError
  >;

  if (!response.ok) {
    throw new Error(JSON.stringify(json));
  }
  revalidateTag('address');
}

export type ChangePasswordState = {
  errors?: {
    password?: string[];
    confirm_password?: string[];
  };
  status: 'iddle' | 'success' | 'error';
  message?: string | null;
};

const ChangePasswordSchema = z
  .object({
    new_password: z.string().min(8),
    confirm_password: z.string(),
  })
  .refine((schema) => schema.new_password === schema.confirm_password, {
    message: 'Confirm password not match',
    path: ['confirm_password'],
  });

export async function changePassword(
  prevState: ChangePasswordState,
  formData: FormData
): Promise<ChangePasswordState> {
  const session = await auth();
  const validatedFields = ChangePasswordSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      status: 'error',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const response = await fetch(`${baseUrl}/auth/change-password`, {
      method: 'POST',
      body: JSON.stringify({ ...validatedFields.data }),
      headers: {
        Authorization: `Bearer ${session?.accessToken}`,
      },
    });

    const data = (await response.json()) as APIResponse<
      { message: string },
      ChangePasswordError
    >;

    if (!response.ok) {
      throw data.errors;
    }

    return {
      status: 'success',
      message: 'Your password has been changed successfully',
    };
  } catch (error) {
    const changePasswordError = error as ChangePasswordError;
    if (changePasswordError.message) {
      return {
        status: 'error',
        message: changePasswordError.message,
      };
    }
    return {
      status: 'error',
      errors: {
        password: changePasswordError.password,
        confirm_password: changePasswordError.confirm_password,
      },
    };
  }
}

export type UploadState = {
  status: 'iddle' | 'success' | 'error';
  message?: string | null;
  data: null | UploadResponse;
};

export async function uploadProfilePicture(
  prevState: UploadState,
  formData: FormData
): Promise<UploadState> {
  const session = await auth();

  try {
    const response = await fetch(`${baseUrl}/uploads/users/images`, {
      method: 'POST',
      body: formData,
      headers: {
        Authorization: `Bearer ${session?.accessToken}`,
      },
    });

    const json = (await response.json()) as APIResponse<
      UploadResponse,
      { message: string }
    >;

    if (!response.ok) {
      throw json.errors;
    }

    return {
      status: 'success',
      message: 'Your profile picture has been changed successfully',
      data: json.data,
    };
  } catch (error) {
    const uploadError = error as { message: string };
    return {
      status: 'error',
      message: uploadError.message,
      data: null,
    };
  } finally {
    revalidateTag('user');
  }
}

export async function saveProfilePicture(uploadId: string) {
  const session = await auth();

  const uploadIdSchema = z.string().uuid();

  const upload_id = uploadIdSchema.parse(uploadId);

  const response = await fetch(`${baseUrl}/users/profile-image`, {
    method: 'POST',
    body: JSON.stringify({ upload_id }),
    headers: {
      Authorization: `Bearer ${session?.accessToken}`,
    },
  });

  const json = (await response.json()) as APIResponse<
    UploadResponse,
    { message: string }
  >;

  if (!response.ok) {
    throw new Error(JSON.stringify(json));
  }

  revalidateTag('user');
}

const genders = ['female', 'male'];

const UserProfileScema = z
  .object({
    name: z.string().min(3).optional(),
    phone: z
      .string()
      .regex(/^(\+62|62|0)8[1-9][0-9]{6,9}$/, {
        message: 'Invalid phone number',
      })
      .optional(),
    gender: z.string().optional(),
    birthdate: z.coerce.date().optional(),
  })
  .refine(
    (schema) => {
      if (schema.gender) {
        return genders.includes(schema.gender);
      }
      return true;
    },
    {
      message: 'invalid gender',
      path: ['gender'],
    }
  );

export type UpdateProfileState = {
  status: 'iddle' | 'success' | 'error';
  errors?: UpdateProfileError;
  message?: string | null;
};

export async function updateUserProfile(
  prevState: UpdateProfileState,
  formData: FormData
): Promise<UpdateProfileState> {
  const session = await auth();
  const validatedFields = UserProfileScema.safeParse({
    name: formData.get('name'),
    phone: formData.get('phone'),
    gender: formData.get('gender'),
    birthdate: formData.get('birthdate'),
  });

  if (!validatedFields.success) {
    return {
      status: 'error',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const response = await fetch(`${baseUrl}/users/profile`, {
      method: 'PATCH',
      body: JSON.stringify({
        ...validatedFields.data,
        birthdate: formData.get('birthdate'),
      }),
      headers: {
        Authorization: `Bearer ${session?.accessToken}`,
      },
    });

    const json = (await response.json()) as APIResponse<
      User,
      { message: string }
    >;

    if (!response.ok) {
      throw json.errors;
    }

    return {
      status: 'success',
      message: 'Your profile has been updated successfully',
    };
  } catch (error) {
    const updateError = error as UpdateProfileError;
    if (updateError.message) {
      return {
        status: 'error',
        message: updateError.message,
      };
    }
    return {
      status: 'error',
      errors: {
        name: updateError.name,
        birthdate: updateError.birthdate,
        gender: updateError.gender,
        phone: updateError.phone,
      },
    };
  } finally {
    revalidateTag('user');
  }
}

export async function updateCartQuantity(productSku: string, quantity: number) {
  const session = await auth();

  const response = await fetch(`${baseUrl}/carts/${productSku}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${session?.accessToken}`,
    },
    body: JSON.stringify({
      quantity,
    }),
  });
  const json = (await response.json()) as APIResponse<
    { message: string } | undefined,
    { message: string }
  >;

  revalidateTag('cart');
  return json;
}

export async function deleteCart(productSku: string) {
  const session = await auth();
  const response = await fetch(
    `https://toko-mojopahit-production.up.railway.app/v1/carts/${productSku}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${session?.accessToken}`,
      },
    }
  );
  const json = (await response.json()) as APIResponse<
    { message: string } | undefined,
    { message: string }
  >;

  revalidateTag('cart');
  return json;
}

export type WishlistActionState = {
  status: 'iddle' | 'success' | 'error';
  message: string | null;
};

export async function deleteWishlist(
  prevState: WishlistActionState,
  formData: FormData
): Promise<WishlistActionState> {
  const session = await auth();
  const productSku = formData.get('sku');

  try {
    const response = await fetch(`${baseUrl}/wishlist/${productSku}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${session?.accessToken}`,
      },
    });
    const json = (await response.json()) as APIResponse<
      { message: string } | undefined,
      { message: string }
    >;

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
    revalidateTag('wishlist');
  }
}
