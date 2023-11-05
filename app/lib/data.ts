import { auth } from '@/auth';
import type {
  APIResponse,
  StoreInformation,
  Product,
  Category,
  User,
  CartItem,
  WishlistItem,
} from './definitions';
import { Session } from 'next-auth';
import { redirect } from 'next/navigation';

export const baseUrl = 'https://toko-mojopahit-production.up.railway.app/v1';

export async function fetchStore(): Promise<
  APIResponse<StoreInformation, { message: string }>
> {
  const response = await fetch(`${baseUrl}/store`, {
    next: {
      tags: ['store'],
    },
  });
  const json = (await response.json()) as APIResponse<
    StoreInformation,
    { message: string }
  >;

  if (!response.ok) {
    throw new Error(JSON.stringify(json));
  }

  return json;
}

export async function fetchUser(session: Session | null): Promise<User | null> {
  if (!session) {
    return null;
  }
  const response = await fetch(`${baseUrl}/users/me`, {
    headers: {
      Authorization: `Bearer ${session?.accessToken}`,
    },
    cache: 'no-cache',
  });
  const json = (await response.json()) as APIResponse<
    User,
    { message: string }
  >;

  if (!response.ok) {
    throw new Error(JSON.stringify(json));
  }

  return json.data;
}

export async function fetchFeaturedProducts(
  limit: number,
  offset: number,
  category: string
): Promise<APIResponse<Product[], { message: string }>> {
  await new Promise((resolve) => setTimeout(resolve, 3000));
  const response = await fetch(
    `${baseUrl}/products?` +
      new URLSearchParams({
        limit: String(limit),
        offset: String(offset),
        featured: String(true),
        category,
      }),
    {
      method: 'GET',
      next: {
        tags: ['product'],
      },
      cache: 'force-cache',
    }
  );
  const json = (await response.json()) as APIResponse<
    Product[],
    { message: string }
  >;
  if (!response.ok) {
    throw new Error(JSON.stringify(json));
  }
  return json;
}

export async function fetchProductsPage(props?: {
  search?: string;
  customizable?: boolean;
  limit?: number;
  offset?: number;
  category?: string;
  featured?: boolean;
  available?: boolean;
}): Promise<
  APIResponse<{ page: number; total_product: number }, { message: string }>
> {
  const response = await fetch(
    `${baseUrl}/products/count?` +
      new URLSearchParams({
        ...Object.fromEntries(
          Object.entries(props ?? {})
            .filter(([_key, value]) => value !== undefined)
            .map(([key, value]) => [key, String(value)])
        ),
      }),
    {
      method: 'GET',
      next: {
        tags: ['product'],
      },
      cache: 'force-cache',
    }
  );
  const json = (await response.json()) as APIResponse<
    { page: number; total_product: number },
    { message: string }
  >;
  if (!response.ok) {
    throw new Error(JSON.stringify(json));
  }
  return json;
}

export async function fetchProducts(props?: {
  search?: string;
  customizable?: boolean;
  limit?: number;
  offset?: number;
  category?: string;
  featured?: boolean;
  available?: boolean;
}): Promise<APIResponse<Product[], { message: string }>> {
  await new Promise((resolve) => setTimeout(resolve, 3000));
  const response = await fetch(
    `${baseUrl}/products?` +
      new URLSearchParams({
        ...Object.fromEntries(
          Object.entries(props ?? {})
            .filter(([_key, value]) => value !== undefined)
            .map(([key, value]) => [key, String(value)])
        ),
      }),
    {
      method: 'GET',
      next: {
        tags: ['product'],
      },
      cache: 'force-cache',
    }
  );
  const json = (await response.json()) as APIResponse<
    Product[],
    { message: string }
  >;
  if (!response.ok) {
    throw new Error(JSON.stringify(json));
  }
  return json;
}

export async function fetchCategoreis(): Promise<
  APIResponse<Category[], { message: string }>
> {
  const response = await fetch(`${baseUrl}/categories`, {
    method: 'GET',
    next: {
      tags: ['category'],
    },
  });

  const json = (await response.json()) as APIResponse<
    Category[],
    { message: string }
  >;

  if (!response.ok) {
    throw new Error(JSON.stringify(json));
  }

  return json;
}

export async function fetchProductDetail(
  id: number
): Promise<Product | undefined> {
  const response = await fetch(
    `https://toko-mojopahit-production.up.railway.app/v1/products/${id}`,
    {
      next: {
        tags: ['product'],
      },
      cache: 'no-cache',
    }
  );
  const json = (await response.json()) as APIResponse<
    Product,
    { message: string }
  >;

  if (!response.ok) {
    if (json.code === 404) {
      return undefined;
    }
    throw new Error(JSON.stringify(json));
  }

  return json.data;
}

export async function checkWishlist(sku: string): Promise<boolean | undefined> {
  const session = await auth();
  if (!session) {
    return undefined;
  }
  const response = await fetch(
    'https://toko-mojopahit-production.up.railway.app/v1/wishlist/check',
    {
      method: 'POST',
      body: JSON.stringify({ sku }),
      headers: {
        Authorization: `Bearer ${session?.accessToken}`,
      },
      next: {
        tags: ['wishlist'],
      },
      cache: 'no-cache',
    }
  );

  const json = (await response.json()) as APIResponse<
    { is_exist: boolean },
    { message: string }
  >;

  if (!response.ok) {
    throw json.errors;
  }

  return json.data.is_exist;
}

export async function fetchCart(): Promise<CartItem[]> {
  const session = await auth();
  if (!session) {
    const searchParams = new URLSearchParams();
    searchParams.set('callbackUrl', '/cart');
    redirect(`/login?${searchParams}`);
  }
  const response = await fetch(`${baseUrl}/carts`, {
    headers: {
      Authorization: `Bearer ${session?.accessToken}`,
    },
    next: {
      tags: ['cart'],
    },
    cache: 'no-cache',
  });
  const json = (await response.json()) as APIResponse<
    CartItem[],
    { message: string }
  >;

  if (!response.ok) {
    throw new Error(JSON.stringify(json));
  }

  return json.data;
}

export async function fetchWishlist(): Promise<WishlistItem[]> {
  const session = await auth();
  if (!session) {
    const searchParams = new URLSearchParams();
    searchParams.set('callbackUrl', '/cart');
    redirect(`/login?${searchParams}`);
  }
  const response = await fetch(`${baseUrl}/wishlist`, {
    headers: {
      Authorization: `Bearer ${session?.accessToken}`,
    },
    next: {
      tags: ['cart'],
    },
    cache: 'no-cache',
  });
  const json = (await response.json()) as APIResponse<
    WishlistItem[],
    { message: string }
  >;

  if (!response.ok) {
    throw new Error(JSON.stringify(json));
  }

  return json.data;
}
