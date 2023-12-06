import { auth } from '@/auth';
import type {
  APIResponse,
  StoreInformation,
  Product,
  Category,
  User,
  CartItem,
  WishlistItem,
  CheckoutItem,
  DetailPayment,
  ListAddresses,
  CustomerAddress,
  OrderInfo,
  Color,
  WikisColors,
  ProductSoldStat,
} from './definitions';
import { Session } from 'next-auth';
import { notFound, redirect } from 'next/navigation';
import { z } from 'zod';
import { decrypt } from './crypto';
import { formatIDR } from './utils';

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
  APIResponse<{ page: number; total_products: number }, { message: string }>
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
    { page: number; total_products: number },
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
        tags: ['product', 'payment'],
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
      tags: ['cart', 'payment-cart'],
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

export async function fetchCartForCheckout(): Promise<CheckoutItem[]> {
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
      tags: ['cart', 'payment-cart'],
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

  const checkoutItems = json.data
    .filter((cartItem) => cartItem.available)
    .map<CheckoutItem>((cartItem) => ({
      sku: cartItem.sku,
      name: cartItem.name,
      image: cartItem.image.url,
      price: cartItem.price,
      quantity: cartItem.quantity,
    }));
  return checkoutItems;
}

export async function fetchTotalCart(): Promise<number | undefined> {
  const session = await auth();
  if (!session) {
    return undefined;
  }
  const response = await fetch(`${baseUrl}/carts/total`, {
    headers: {
      Authorization: `Bearer ${session?.accessToken}`,
    },
    next: {
      tags: ['cart', 'payment-cart'],
    },
    cache: 'no-cache',
  });
  const json = (await response.json()) as APIResponse<
    { total: number },
    { message: string }
  >;

  if (!response.ok) {
    throw new Error(JSON.stringify(json));
  }

  return json.data.total;
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
      tags: ['cart', 'payment-cart'],
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

const CheckoutItemSchema = z.object({
  sku: z.string(),
  name: z.string(),
  image: z.string().url(),
  price: z.coerce.number(),
  quantity: z.coerce.number(),
});

export async function decryptToken(
  token?: string
): Promise<CheckoutItem[] | undefined> {
  const session = await auth();
  if (!session || !token) notFound();
  const decriptedData = decrypt(token);

  try {
    const data = CheckoutItemSchema.parse(JSON.parse(decriptedData));
    return [data];
  } catch (error) {
    console.log(error);
    return undefined;
  }
}

export async function fetchDetailPayment(
  paymentId: string
): Promise<DetailPayment | undefined> {
  const session = await auth();
  if (!session) {
    return undefined;
  }
  const response = await fetch(`${baseUrl}/payments/${paymentId}`, {
    headers: {
      Authorization: `Bearer ${session?.accessToken}`,
    },
    next: {
      tags: ['payment', 'payment-cart'],
    },
    cache: 'no-cache',
  });
  const json = (await response.json()) as APIResponse<
    DetailPayment,
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

export async function fetchListAdmin(props?: {
  limit?: number;
  offset?: number;
}): Promise<User[] | undefined> {
  const session = await auth();
  if (!session) {
    return undefined;
  }
  const response = await fetch(
    `${baseUrl}/admin?` +
      new URLSearchParams({
        ...Object.fromEntries(
          Object.entries(props ?? {})
            .filter(([_key, value]) => value !== undefined)
            .map(([key, value]) => [key, String(value)])
        ),
      }),
    {
      headers: {
        Authorization: `Bearer ${session?.accessToken}`,
      },
      next: {
        tags: ['admin'],
      },
      cache: 'no-cache',
    }
  );
  const json = (await response.json()) as APIResponse<
    User[],
    { message: string }
  >;

  if (!response.ok) {
    throw new Error(JSON.stringify(json));
  }

  return json.data;
}

export async function fetchAdminsPage(props?: {
  limit?: number;
  offset?: number;
}): Promise<
  APIResponse<{ page: number; total_admins: number }, { message: string }>
> {
  const session = await auth();
  const response = await fetch(
    `${baseUrl}/admin/count?` +
      new URLSearchParams({
        ...Object.fromEntries(
          Object.entries(props ?? {})
            .filter(([_key, value]) => value !== undefined)
            .map(([key, value]) => [key, String(value)])
        ),
      }),
    {
      headers: {
        Authorization: `Bearer ${session?.accessToken}`,
      },
      method: 'GET',
      next: {
        tags: ['admin'],
      },
      cache: 'force-cache',
    }
  );
  const json = (await response.json()) as APIResponse<
    { page: number; total_admins: number },
    { message: string }
  >;
  if (!response.ok) {
    throw new Error(JSON.stringify(json));
  }
  return json;
}

export const colorData = [
  {
    name: 'Black',
    hex: '#000000',
  },
  {
    name: 'Blue',
    hex: '#0000FF',
  },
  {
    name: 'Brown',
    hex: '#A52A2A',
  },
  {
    name: 'Burgundy',
    hex: '#800020',
  },
  {
    name: 'Chocolate',
    hex: '#D2691E',
  },
  {
    name: 'Cyan',
    hex: '#00FFFF',
  },
  {
    name: 'Gold',
    hex: '#FFD700',
  },
  {
    name: 'Gray',
    hex: '#808080',
  },
  {
    name: 'Green',
    hex: '#008000',
  },
  {
    name: 'Lavender',
    hex: '#E6E6FA',
  },
  {
    name: 'Lime',
    hex: '#00FF00',
  },
  {
    name: 'Magenta',
    hex: '#FF00FF',
  },
  {
    name: 'Maroon',
    hex: '#800000',
  },
  {
    name: 'Navy',
    hex: '#000080',
  },
  {
    name: 'Orange',
    hex: '#FF7F00',
  },
  {
    name: 'Peach',
    hex: '#FFE5B4',
  },
  {
    name: 'Pink',
    hex: '#FFC0CB',
  },
  {
    name: 'Purple',
    hex: '#800080',
  },
  {
    name: 'Red',
    hex: '#FF0000',
  },
  {
    name: 'Rose',
    hex: '#FF007F',
  },
  {
    name: 'Tangerine',
    hex: '#F28500',
  },
  {
    name: 'Teal',
    hex: '#008080',
  },
  {
    name: 'Turquoise',
    hex: '#40E0D0',
  },
  {
    name: 'Vanilla',
    hex: '#F3E5AB',
  },
  {
    name: 'Violet',
    hex: '#8F00FF',
  },
  {
    name: 'White',
    hex: '#FFFFFF',
  },
  {
    name: 'Yellow',
    hex: '#FFFF00',
  },
];

export default async function fetchListAddress(): Promise<ListAddresses> {
  const session = await auth();
  await new Promise((resolve) => setTimeout(resolve, 3000));
  const response = await fetch(`${baseUrl}/users/addresses`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${session?.accessToken}`,
    },
    next: {
      tags: ['address'],
    },
    cache: 'force-cache',
  });

  const json = (await response.json()) as APIResponse<
    ListAddresses,
    { message: string }
  >;

  if (!response.ok) {
    throw new Error(JSON.stringify(json));
  }

  return json.data;
}

export async function fetchDetailAddress(
  addressId: string
): Promise<CustomerAddress | undefined> {
  const session = await auth();
  if (!session) {
    return undefined;
  }
  const response = await fetch(`${baseUrl}/users/addresses/${addressId}`, {
    headers: {
      Authorization: `Bearer ${session?.accessToken}`,
    },
    next: {
      tags: ['payment', 'payment-cart'],
    },
    cache: 'no-cache',
  });
  const json = (await response.json()) as APIResponse<
    CustomerAddress,
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

export async function fetchListPendingPayment(): Promise<Array<DetailPayment>> {
  const session = await auth();
  await new Promise((resolve) => setTimeout(resolve, 3000));
  const response = await fetch(`${baseUrl}/payments`, {
    headers: {
      Authorization: `Bearer ${session?.accessToken}`,
    },
    next: {
      tags: ['payment', 'payment-cart'],
    },
    cache: 'no-cache',
  });
  const json = (await response.json()) as APIResponse<
    Array<DetailPayment>,
    { message: string }
  >;

  if (!response.ok) {
    throw new Error(JSON.stringify(json));
  }

  return json.data;
}

export async function fetchListOrder(props?: {
  limit?: number;
  offset?: number;
  status?: string;
}): Promise<OrderInfo[]> {
  const session = await auth();
  if (!session) {
    redirect('/login?' + new URLSearchParams({ callbackUrl: '/orders' }));
  }
  const response = await fetch(
    `${baseUrl}/orders?` +
      new URLSearchParams({
        ...Object.fromEntries(
          Object.entries(props ?? {})
            .filter(([_key, value]) => value !== undefined)
            .map(([key, value]) => [key, String(value)])
        ),
      }),
    {
      headers: {
        Authorization: `Bearer ${session?.accessToken}`,
      },
      next: {
        tags: ['order'],
      },
      cache: 'no-cache',
    }
  );
  const json = (await response.json()) as APIResponse<
    OrderInfo[],
    { message: string }
  >;

  if (!response.ok) {
    throw new Error(JSON.stringify(json));
  }

  return json.data;
}

export async function fetchOrderDetails(orderId: string): Promise<OrderInfo> {
  const session = await auth();
  if (!session) {
    redirect('/login?' + new URLSearchParams({ callbackUrl: '/orders' }));
  }
  const response = await fetch(`${baseUrl}/orders/${orderId}`, {
    headers: {
      Authorization: `Bearer ${session?.accessToken}`,
    },
    next: {
      tags: ['order'],
    },
    cache: 'no-cache',
  });
  const json = (await response.json()) as APIResponse<
    OrderInfo,
    { message: string }
  >;

  if (!response.ok) {
    throw new Error(JSON.stringify(json));
  }

  return json.data;
}

export async function fetchWikipediasColors(): Promise<Color[]> {
  const response = await fetch('https://api.color.pizza/v1/?list=wikipedia', {
    method: 'GET',
    next: {
      tags: ['color'],
    },
    cache: 'force-cache',
  });
  const json = (await response.json()) as WikisColors;
  if (!response.ok) {
    throw new Error(JSON.stringify(json));
  }
  return json.colors;
}

export async function fetchCardData() {
  try {
    const data = await Promise.all([
      fetchTotalSuccessPayment(),
      fetchTotalPendingPayment(),
      fetchCountOrder(),
      fetchCountTransaction(),
    ]);
    return {
      totalPaid: formatIDR(data[0]),
      totalPendingPayment: formatIDR(data[1]),
      totalOrders: data[2],
      totalTransactions: data[3],
    };
  } catch (error) {
    console.log(error);
    throw new Error('Failed to card data.');
  }
}

export async function fetchCountOrder(): Promise<number> {
  const session = await auth();
  const response = await fetch(`${baseUrl}/orders/count`, {
    headers: {
      Authorization: `Bearer ${session?.accessToken}`,
    },
    next: {
      tags: ['order'],
    },
    cache: 'no-cache',
  });
  const json = (await response.json()) as APIResponse<
    { total_count: number },
    { message: string }
  >;

  if (!response.ok) {
    throw new Error(JSON.stringify(json));
  }

  return json.data.total_count;
}

export async function fetchCountTransaction(): Promise<number> {
  const session = await auth();
  const response = await fetch(`${baseUrl}/payments/count`, {
    headers: {
      Authorization: `Bearer ${session?.accessToken}`,
    },
    next: {
      tags: ['payment'],
    },
    cache: 'no-cache',
  });
  const json = (await response.json()) as APIResponse<
    { total_count: number },
    { message: string }
  >;

  if (!response.ok) {
    throw new Error(JSON.stringify(json));
  }

  return json.data.total_count;
}

export async function fetchTotalPendingPayment(): Promise<number> {
  const session = await auth();
  const response = await fetch(`${baseUrl}/payments/total-pending`, {
    headers: {
      Authorization: `Bearer ${session?.accessToken}`,
    },
    next: {
      tags: ['payment'],
    },
    cache: 'no-cache',
  });
  const json = (await response.json()) as APIResponse<
    { total: number },
    { message: string }
  >;

  if (!response.ok) {
    throw new Error(JSON.stringify(json));
  }

  return json.data.total;
}

export async function fetchTotalSuccessPayment(): Promise<number> {
  const session = await auth();
  const response = await fetch(`${baseUrl}/payments/total-success`, {
    headers: {
      Authorization: `Bearer ${session?.accessToken}`,
    },
    next: {
      tags: ['payment'],
    },
    cache: 'no-cache',
  });
  const json = (await response.json()) as APIResponse<
    { total: number },
    { message: string }
  >;

  if (!response.ok) {
    throw new Error(JSON.stringify(json));
  }

  return json.data.total;
}

export async function fetchProductSoldStats(): Promise<ProductSoldStat[]> {
  const session = await auth();
  const response = await fetch(`${baseUrl}/orders/stats`, {
    headers: {
      Authorization: `Bearer ${session?.accessToken}`,
    },
    next: {
      tags: ['order'],
    },
    cache: 'no-cache',
  });
  const json = (await response.json()) as APIResponse<
    ProductSoldStat[],
    { message: string }
  >;

  if (!response.ok) {
    throw new Error(JSON.stringify(json));
  }

  return json.data;
}
