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
} from "./definitions";
import { Session } from "next-auth";
import { notFound, redirect } from "next/navigation";
import { z } from "zod";
import { decrypt } from "./crypto";
import { formatIDR } from "./utils";
import { headers } from "next/headers";

export const baseUrl =
  "https://toko-mojopahit-production-8a47.up.railway.app/v1";

export async function fetchStore(): Promise<
  APIResponse<StoreInformation, { message: string }>
> {
  const response = await fetch(`${baseUrl}/store`, {
    next: {
      tags: ["store"],
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
    cache: "no-cache",
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
  category: string,
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
      method: "GET",
      next: {
        tags: ["product"],
      },
      cache: "no-cache",
    },
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
            .map(([key, value]) => [key, String(value)]),
        ),
      }),
    {
      method: "GET",
      next: {
        tags: ["product"],
      },
      cache: "no-cache",
    },
  );
  const json = (await response.json()) as APIResponse<
    { page: number; total_products: number },
    { message: string }
  >;
  // console.log(json.data.page);
  if (!response.ok) {
    throw new Error(JSON.stringify(json));
  }
  return json;
}

export async function fetchOrdersPage(props?: {
  status?: string;
  limit?: number;
  offset?: number;
}): Promise<
  APIResponse<{ page: number; total_orders: number }, { message: string }>
> {
  const Authorization = headers().get("Authorization") ?? "";
  const response = await fetch(
    `${baseUrl}/orders/count-page?` +
      new URLSearchParams({
        ...Object.fromEntries(
          Object.entries(props ?? {})
            .filter(([_key, value]) => value !== undefined)
            .map(([key, value]) => [key, String(value)]),
        ),
      }),
    {
      method: "GET",
      next: {
        tags: ["order"],
      },
      headers: {
        Authorization,
      },
      cache: "no-cache",
    },
  );
  const json = (await response.json()) as APIResponse<
    { page: number; total_orders: number },
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
            .map(([key, value]) => [key, String(value)]),
        ),
      }),
    {
      method: "GET",
      next: {
        tags: ["product"],
      },
      cache: "no-cache",
    },
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
    method: "GET",
    next: {
      tags: ["category"],
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
  id: number,
): Promise<Product | undefined> {
  const response = await fetch(
    `https://toko-mojopahit-production.up.railway.app/v1/products/${id}`,
    {
      next: {
        tags: ["product", "payment"],
      },
      cache: "no-cache",
    },
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
  const Authorization = headers().get("Authorization");
  if (!Authorization) {
    return undefined;
  }
  const response = await fetch(
    "https://toko-mojopahit-production.up.railway.app/v1/wishlist/check",
    {
      method: "POST",
      body: JSON.stringify({ sku }),
      headers: {
        Authorization,
      },
      next: {
        tags: ["wishlist"],
      },
      cache: "no-cache",
    },
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
  const Authorization = headers().get("Authorization") ?? "";
  const response = await fetch(`${baseUrl}/carts`, {
    headers: {
      Authorization,
    },
    next: {
      tags: ["cart", "payment-cart"],
    },
    cache: "no-cache",
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
  const Authorization = headers().get("Authorization") ?? "";
  const response = await fetch(`${baseUrl}/carts`, {
    headers: {
      Authorization,
    },
    next: {
      tags: ["cart", "payment-cart"],
    },
    cache: "no-cache",
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
  // console.log("fetch total cart");
  const Authorization = headers().get("Authorization");

  if (!Authorization) {
    return undefined;
  }

  const response = await fetch(`${baseUrl}/carts/total`, {
    headers: {
      Authorization,
    },
    next: {
      tags: ["cart", "payment-cart"],
    },
    cache: "no-cache",
  });
  const json = (await response.json()) as APIResponse<
    { total: number },
    { message: string }
  >;

  // console.log(json.data);

  // console.log("fetch total cart done");

  if (!response.ok) {
    throw new Error(JSON.stringify(json));
  }

  return json.data.total;
}

export async function fetchWishlist(): Promise<WishlistItem[]> {
  const Authorization = headers().get("Authorization") ?? "";
  const response = await fetch(`${baseUrl}/wishlist`, {
    headers: {
      Authorization,
    },
    next: {
      tags: ["cart", "payment-cart"],
    },
    cache: "no-cache",
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
  token?: string,
): Promise<CheckoutItem[] | undefined> {
  const authorization = headers().get("Authorization");
  if (!authorization || !token) notFound();
  const decriptedData = decrypt(token);

  try {
    const data = CheckoutItemSchema.parse(JSON.parse(decriptedData));
    return [data];
  } catch (error) {
    // console.log(error);
    return undefined;
  }
}

export async function fetchDetailPayment(
  paymentId: string,
): Promise<DetailPayment | undefined> {
  const Authorization = headers().get("Authorization") ?? "";
  const response = await fetch(`${baseUrl}/payments/${paymentId}`, {
    headers: {
      Authorization,
    },
    next: {
      tags: ["payment", "payment-cart"],
    },
    cache: "no-cache",
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
  const Authorization = headers().get("Authorization");
  if (!Authorization) {
    return undefined;
  }
  const response = await fetch(
    `${baseUrl}/admin?` +
      new URLSearchParams({
        ...Object.fromEntries(
          Object.entries(props ?? {})
            .filter(([_key, value]) => value !== undefined)
            .map(([key, value]) => [key, String(value)]),
        ),
      }),
    {
      headers: {
        Authorization,
      },
      next: {
        tags: ["admin"],
      },
      cache: "no-cache",
    },
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
  const Authorization = headers().get("Authorization") ?? "";
  const response = await fetch(
    `${baseUrl}/admin/count?` +
      new URLSearchParams({
        ...Object.fromEntries(
          Object.entries(props ?? {})
            .filter(([_key, value]) => value !== undefined)
            .map(([key, value]) => [key, String(value)]),
        ),
      }),
    {
      headers: {
        Authorization,
      },
      method: "GET",
      next: {
        tags: ["admin"],
      },
      cache: "force-cache",
    },
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

export default async function fetchListAddress(): Promise<ListAddresses> {
  const Authorization = headers().get("Authorization") ?? "";
  await new Promise((resolve) => setTimeout(resolve, 3000));
  const response = await fetch(`${baseUrl}/users/addresses`, {
    method: "GET",
    headers: {
      Authorization,
    },
    next: {
      tags: ["address"],
    },
    cache: "force-cache",
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
  addressId: string,
): Promise<CustomerAddress | undefined> {
  const Authorization = headers().get("Authorization");
  if (!Authorization) {
    return undefined;
  }
  const response = await fetch(`${baseUrl}/users/addresses/${addressId}`, {
    headers: {
      Authorization,
    },
    next: {
      tags: ["payment", "payment-cart"],
    },
    cache: "no-cache",
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
  const Authorization = headers().get("Authorization") ?? "";
  console.log(Authorization);
  await new Promise((resolve) => setTimeout(resolve, 3000));
  const response = await fetch(`${baseUrl}/payments`, {
    headers: {
      Authorization,
    },
    next: {
      tags: ["payment", "payment-cart"],
    },
    cache: "no-cache",
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
  const Authorization = headers().get("Authorization") ?? "";
  const response = await fetch(
    `${baseUrl}/orders?` +
      new URLSearchParams({
        ...Object.fromEntries(
          Object.entries(props ?? {})
            .filter(([_key, value]) => value !== undefined)
            .map(([key, value]) => [key, String(value)]),
        ),
      }),
    {
      headers: {
        Authorization,
      },
      next: {
        tags: ["order"],
      },
      cache: "no-cache",
    },
  );
  const json = (await response.json()) as APIResponse<
    OrderInfo[],
    { message: string }
  >;

  // console.log(json);

  if (!response.ok) {
    throw new Error(JSON.stringify(json));
  }

  return json.data;
}

export async function fetchOrderDetails(orderId: string): Promise<OrderInfo> {
  const Authorization = headers().get("Authorization") ?? "";
  const response = await fetch(`${baseUrl}/orders/${orderId}`, {
    headers: {
      Authorization,
    },
    next: {
      tags: ["order"],
    },
    cache: "no-cache",
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
  const response = await fetch("https://api.color.pizza/v1/?list=wikipedia", {
    method: "GET",
    next: {
      tags: ["color"],
    },
    cache: "force-cache",
  });
  const json = (await response.json()) as WikisColors;
  if (!response.ok) {
    throw new Error(JSON.stringify(json));
  }
  return json.colors;
}

export async function fetchCardData() {
  const Authorization = headers().get("Authorization") ?? "";
  if (!Authorization) {
    redirect("/login");
  }
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
    // console.log(error);
    throw new Error("Failed to card data.");
  }
}

export async function fetchCountOrder(): Promise<number> {
  const Authorization = headers().get("Authorization") ?? "";
  const response = await fetch(`${baseUrl}/orders/count`, {
    headers: {
      Authorization,
    },
    next: {
      tags: ["order"],
    },
    cache: "no-cache",
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
  const Authorization = headers().get("Authorization") ?? "";
  const response = await fetch(`${baseUrl}/payments/count`, {
    headers: {
      Authorization,
    },
    next: {
      tags: ["payment"],
    },
    cache: "no-cache",
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
  const Authorization = headers().get("Authorization") ?? "";
  const response = await fetch(`${baseUrl}/payments/total-pending`, {
    headers: {
      Authorization,
    },
    next: {
      tags: ["payment"],
    },
    cache: "no-cache",
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
  const Authorization = headers().get("Authorization") ?? "";
  const response = await fetch(`${baseUrl}/payments/total-success`, {
    headers: {
      Authorization,
    },
    next: {
      tags: ["payment"],
    },
    cache: "no-cache",
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
  const Authorization = headers().get("Authorization") ?? "";
  const response = await fetch(`${baseUrl}/orders/stats`, {
    headers: {
      Authorization,
    },
    next: {
      tags: ["order"],
    },
    cache: "no-cache",
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
