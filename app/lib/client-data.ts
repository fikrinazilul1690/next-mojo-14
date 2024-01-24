import {
  APIResponse,
  Bank,
  CartItem,
  Category,
  Color,
  DetailPayment,
  Item,
  ListAddresses,
  ListLocation,
  Pricing,
  RateResponse,
} from "./definitions";

const baseUrl = "https://toko-mojopahit-production-8a47.up.railway.app/v1";

export async function fetchCart(
  accessToken: string | null,
): Promise<CartItem[] | undefined> {
  if (!accessToken) {
    return undefined;
  }
  const response = await fetch(`${baseUrl}/carts`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
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

export async function fetchListAddress(
  accessToken: string | null,
): Promise<ListAddresses | undefined> {
  if (!accessToken) {
    return undefined;
  }
  const response = await fetch(`${baseUrl}/users/addresses`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
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

export const listBank: Array<{
  code: Bank;
  name: string;
  imageUrl: string;
}> = [
  {
    code: "bca",
    name: "Bank BCA",
    imageUrl: "/bca.png",
  },
  {
    code: "bni",
    name: "Bank BNI",
    imageUrl: "/bni.png",
  },
  {
    code: "bri",
    name: "Bank BRI",
    imageUrl: "/bri.png",
  },
  {
    code: "permata",
    name: "Bank Permata",
    imageUrl: "/permata_bank.png",
  },
];

export const limitRange = [
  {
    value: "1",
  },
  {
    value: "5",
  },
  {
    value: "10",
  },
  {
    value: "15",
  },
  {
    value: "20",
  },
];

export async function fetchCourierPricing(
  accessToken: string | null,
  addressId: number,
  items: Item[],
): Promise<Array<Pricing> | undefined> {
  if (!accessToken) {
    return undefined;
  }
  const response = await fetch(`${baseUrl}/rates`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      address_id: addressId,
      items,
    }),
  });

  const json = (await response.json()) as APIResponse<
    RateResponse,
    { message: string }
  >;

  if (!response.ok) {
    throw new Error(JSON.stringify(json));
  }

  return json.data.pricing;
}

export async function fetchDetailPayment(
  accessToken: string | null,
  paymentId: string,
): Promise<DetailPayment> {
  const response = await fetch(`${baseUrl}/payments/${paymentId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const json = (await response.json()) as APIResponse<
    DetailPayment,
    { message: string }
  >;

  if (!response.ok) {
    throw new Error(JSON.stringify(json));
  }

  return json.data;
}

export async function fetchCategoreis(): Promise<Category[]> {
  const response = await fetch(`${baseUrl}/categories`, {
    method: "GET",
  });

  const json = (await response.json()) as APIResponse<
    Category[],
    { message: string }
  >;

  if (!response.ok) {
    throw new Error(JSON.stringify(json));
  }

  return json.data;
}

export async function fetchLocations(
  search: string,
): Promise<ListLocation | undefined> {
  const response = await fetch(
    `${baseUrl}/locations?` +
      new URLSearchParams({
        search,
      }),
    {
      method: "GET",
    },
  );

  const json = (await response.json()) as APIResponse<
    ListLocation,
    { message: string }
  >;

  if (!response.ok) {
    throw new Error(JSON.stringify(json));
  }

  return json.data;
}

export async function fetchNtcColors(name: string): Promise<Color[]> {
  const response = await fetch(
    `https://api.color.pizza/v1/names/?list=ntc&name=${name}`,
    {
      method: "GET",
      next: {
        tags: ["color"],
      },
      cache: "force-cache",
    },
  );
  const json = await response.json();
  if (!response.ok) {
    throw (
      json as {
        error: { status: number; message: string };
      }
    ).error;
  }
  return (
    json as {
      colors: Color[];
    }
  ).colors;
}
