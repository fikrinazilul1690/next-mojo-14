import { baseUrl } from './data';
import {
  APIResponse,
  Bank,
  CartItem,
  Item,
  ListAddresses,
  Pricing,
  RateResponse,
} from './definitions';

export async function fetchCart(
  accessToken: string | null
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

export async function fetchAddresses(
  accessToken: string | null
): Promise<ListAddresses | undefined> {
  if (!accessToken) {
    return undefined;
  }
  const response = await fetch(`${baseUrl}/users/addresses`, {
    method: 'GET',
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
    code: 'bca',
    name: 'Bank BCA',
    imageUrl: '/bca.png',
  },
  {
    code: 'bni',
    name: 'Bank BNI',
    imageUrl: '/bni.png',
  },
  {
    code: 'bri',
    name: 'Bank BRI',
    imageUrl: '/bri.png',
  },
  {
    code: 'permata',
    name: 'Bank Permata',
    imageUrl: '/permata_bank.png',
  },
];

export const limitRange = [
  {
    value: '1',
  },
  {
    value: '5',
  },
  {
    value: '10',
  },
  {
    value: '15',
  },
  {
    value: '20',
  },
];

export async function fetchCourierPricing(
  accessToken: string | null,
  addressId: number,
  items: Item[]
): Promise<Array<Pricing> | undefined> {
  if (!accessToken) {
    return undefined;
  }
  const response = await fetch(`${baseUrl}/rates`, {
    method: 'POST',
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
