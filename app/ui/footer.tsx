import Link from 'next/link';
import { FiFacebook, FiInstagram, FiMapPin, FiMail } from 'react-icons/fi';

import { FaWhatsapp } from 'react-icons/fa6';
import { fetchStore } from '@/app/lib/data';

export default async function Footer() {
  const storeRes = await fetchStore();
  const store = storeRes.data;
  return (
    <footer className='text-center'>
      <span className='mt-12 bg-slate-500 h-[1px] block' />
      <div className='max-w-[1340px] mx-auto flex justify-evenly sm:flex-row max-sm:gap-3 flex-col mt-5'>
        <div className='flex justify-evenly sm:justify-between items-center h-[200px] flex-col'>
          <h2 className='text-xl font-semibold'>MOJOPAHIT FURNITUR</h2>
          <p className='break-words w-96 max-sm:w-64 text-sm'>
            Mojopahit Furniture adalah toko yang menyediakan solusi terbaik
            untuk kebutuhan furnitur Anda. Kami menghadirkan furnitur dengan
            desain yang elegan dan fungsional untuk memperindah rumah Anda
          </p>
          <div className='flex gap-3 justify-center items-center'>
            <Link href='/'>
              <FiFacebook size={30} />
            </Link>
            <Link href='/'>
              <FiInstagram size={30} />
            </Link>
          </div>
        </div>
        <div className='flex flex-col sm:w-[350px] sm:items-start items-center justify-between'>
          <h2 className='text-xl font-semibold'>HUBUNGI KAMI</h2>
          <div className='flex gap-2 justify-start items-center'>
            <FiMapPin size={20} />
            <Link href='https://goo.gl/maps/2vXEigTcvTfx86wd8' target='_blank'>
              {store?.address.full_address}
            </Link>
          </div>
          <div className='flex gap-2 justify-start items-center'>
            <FaWhatsapp size={20} />
            <Link href={`https://wa.me/${store?.phone}`} target='_blank'>
              {store?.phone}
            </Link>
          </div>
          <div className='flex gap-2 justify-start items-center'>
            <FiMail size={20} />
            <Link target='_blank' href={`mailto:${store?.email}`}>
              {store?.email}
            </Link>
          </div>
        </div>
      </div>
      <p className='mt-9 mb-3'>
        Copyright &copy; 2023 Mojopahit Furniture. All rights reserved.
      </p>
    </footer>
  );
}
