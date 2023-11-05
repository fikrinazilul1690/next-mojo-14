import { Button } from '@nextui-org/button';
import { RxCross2 } from 'react-icons/rx';
import { RiDeleteBin6Line } from 'react-icons/ri';

type Props = {
  onClick?: () => void;
  ariaLabel: string;
  variant: 'x' | 'bin';
};

export default function DeleteButton({ onClick, ariaLabel, variant }: Props) {
  return (
    <Button
      isIconOnly
      variant={variant === 'x' ? 'light' : 'solid'}
      aria-label={ariaLabel}
      onClick={onClick}
    >
      {variant === 'x' ? (
        <RxCross2 size={18} />
      ) : (
        <RiDeleteBin6Line size={18} />
      )}
    </Button>
  );
}
