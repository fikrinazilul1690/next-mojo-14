import { Session } from 'next-auth';
import { baseUrl } from './data';
import { APIResponse, CartItem } from './definitions';

export async function fetchCart(
  session: Session | null
): Promise<CartItem[] | undefined> {
  if (!session) {
    return undefined;
  }
  const response = await fetch(`${baseUrl}/carts`, {
    headers: {
      Authorization: `Bearer ${session?.accessToken}`,
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

export async function fetchTotalCart(
  session: Session | null
): Promise<number | undefined> {
  if (!session) {
    return undefined;
  }
  const response = await fetch(`${baseUrl}/carts/total`, {
    headers: {
      Authorization: `Bearer ${session?.accessToken}`,
    },
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
