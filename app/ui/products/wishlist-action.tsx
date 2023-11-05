import { checkWishlist } from '@/app/lib/data';
import WishlistButton from './wishlist-button';
type Props = {
  sku: string;
  productId: number;
};
export default async function WishlistAction({ sku, productId }: Props) {
  const isExist = await checkWishlist(sku);
  return <WishlistButton isExist={isExist} productId={productId} sku={sku} />;
}
