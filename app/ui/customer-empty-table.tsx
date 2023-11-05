import { Button } from '@nextui-org/button';
import { Link } from '@nextui-org/link';

type Props = {
  title: string;
};

export default function CustomerEmptyTable({ title }: Props) {
  return (
    <div className='flex flex-col justify-center items-center gap-4'>
      <h1 className='text-3xl'>{title}</h1>
      <Button as={Link} href='/products' color='primary' variant='solid'>
        Shop Now
      </Button>
    </div>
  );
}
