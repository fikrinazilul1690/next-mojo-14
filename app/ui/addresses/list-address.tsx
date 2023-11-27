import fetchListAddress from '@/app/lib/data';
import ListAddressClient from './list-address-client';

export default async function AddressesList() {
  const listAddress = await fetchListAddress();
  return <ListAddressClient listAddress={listAddress} />;
}
