'use client';
import Image from 'next/image';
import ProductType from './product-type';
import ProductStatus from './product-status';
import { formatIDR } from '@/app/lib/utils';
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from '@nextui-org/table';
import { DeleteProduct, UpdateProduct } from './product-button';
import { Product } from '@/app/lib/definitions';

const columns = [
  { name: 'Product', uid: 'product' },
  { name: 'Type', uid: 'type' },
  { name: 'Status', uid: 'status' },
  { name: 'Price', uid: 'price' },
  { name: '', uid: 'actions' },
];

export default function ProductsTableClient({
  products,
}: {
  products: Product[];
}) {
  return (
    <Table aria-label='Products tabel'>
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn key={column.uid} align={'center'}>
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody items={products}>
        {(product) => (
          <TableRow key={product.id}>
            <TableCell>
              <div className='mb-2 flex items-center'>
                <Image
                  src={product.images[0].url}
                  className='mr-2 rounded-sm'
                  width={34}
                  height={34}
                  alt={`${product.name}`}
                />
                <p>{product.name}</p>
              </div>
            </TableCell>
            <TableCell>
              <ProductType type={product.customizable} />
            </TableCell>
            <TableCell>
              <ProductStatus status={product.available} />
            </TableCell>
            <TableCell>
              <p className='text-xl font-medium'>
                {formatIDR(product.min_price ?? 0).replace(/(\.|,)00$/g, '')}
              </p>
            </TableCell>
            <TableCell>
              <div className='relative flex items-center gap-2'>
                <UpdateProduct />
                <DeleteProduct />
              </div>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
