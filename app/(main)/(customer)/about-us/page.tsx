import { Button } from '@nextui-org/button';
import Image from 'next/image';
import Link from 'next/link';

export default function Page() {
  return (
    <main className='w-3/5 my-20 mx-auto grid gap-10 grid-cols-2'>
      <div className='relative col-span-1 h-[400px]'>
        <Image
          className='object-cover'
          fill
          alt='about us'
          src='/about-us.jpeg'
        />
      </div>
      <div className='flex flex-col gap-2 items-start'>
        <h3 className='text-xl font-bold'>
          Selamat Datang di Toko Mojopahit Furniture
        </h3>
        <p>
          Temukan keindahan dan kenyamanan di rumah Anda dengan koleksi
          eksklusif dari Toko Mojopahit Furniture! Dari gaya klasik yang elegan
          hingga desain modern yang minimalis, kami memiliki pilihan furniture
          terbaik untuk memenuhi segala kebutuhan dekorasi rumah Anda. Dibuat
          dengan kualitas terbaik dan sentuhan kerajinan tangan, setiap potongan
          furniture kami adalah karya seni yang akan menghadirkan suasana hangat
          dan memikat di setiap ruangan. Kunjungi toko kami dan temukan
          inspirasi baru untuk mengubah rumah Anda menjadi tempat yang sempurna
          untuk bersantai dan merayakan keindahan hidup.
        </p>
        <Button as={Link} href='/products' color='primary'>
          Shop Now
        </Button>
      </div>
    </main>
  );
}
