import { RiShieldCheckLine } from 'react-icons/ri';
import { IoRibbonOutline } from 'react-icons/io5';
import { TbTruckReturn } from 'react-icons/tb';

type Icons = 'ribbon' | 'truck' | 'shield-check';

type Params = {
  Icon: Icons;
  title: string;
  body: string;
};

export function Slogan({ Icon, title, body }: Params) {
  const icon = getIconFromName(Icon);
  return (
    <div className='w-4/6 sm:w-fit max-sm:text-center'>
      <div className='w-[90px] h-[90px] rounded-full border border-separate ml-0 my-auto max-sm:mx-auto flex items-center justify-center'>
        {icon}
      </div>
      <h2 className='text-xl font-bold'>{title}</h2>
      <p className='break-words sm:w-[225px] text-sm'>{body}</p>
    </div>
  );
}

export default function ListSlogan() {
  return (
    <div className='h-fit sm:h-[214px] mt-5 mb-3 flex flex-col sm:flex-row sm:justify-between justify-center items-center'>
      <Slogan
        Icon='ribbon'
        title='Best Quality Product'
        body='Produk unggulan dengan standar kualitas tertinggi untuk pengalaman yang terbaik.'
      />
      <Slogan
        Icon='truck'
        title='90 Days Return'
        body='Nikmati pengalaman luar biasa dengan jaminan pengembalian selama 90 hari.'
      />
      <Slogan
        Icon='shield-check'
        title='Secure Payment'
        body='Produk kami menghadirkan kepercayaan dan kenyamanan dalam bertransaksi.'
      />
    </div>
  );
}

const getIconFromName = (iconName: Icons) => {
  switch (iconName) {
    case 'ribbon':
      return <IoRibbonOutline size={80} />;
    case 'truck':
      return <TbTruckReturn size={80} />;
    case 'shield-check':
      return <RiShieldCheckLine size={80} />;
  }
};
