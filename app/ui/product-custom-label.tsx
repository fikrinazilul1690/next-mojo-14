import { Chip } from '@nextui-org/chip';
type Props = {
  className: string;
};
export default function ProductCustomLabel({ className }: Props) {
  return (
    <Chip
      className={className}
      classNames={{
        content: 'font-bold',
      }}
      radius='md'
      size='md'
      color='default'
      variant='flat'
    >
      Custom
    </Chip>
  );
}
