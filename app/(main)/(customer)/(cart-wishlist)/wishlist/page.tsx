import { fetchWishlist } from '@/app/lib/data';
import WishlistTable from '@/app/ui/wishlist/wishlist-table';

export default async function Page() {
  const wishlist = await fetchWishlist();
  return <WishlistTable wishlist={wishlist} />;
}
