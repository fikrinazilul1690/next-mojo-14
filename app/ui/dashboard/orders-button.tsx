'use client';
import { Tooltip } from '@nextui-org/tooltip';
import { MdScheduleSend } from 'react-icons/md';
import { SubmitButton } from '../submit-button';
import { OrderInfo } from '@/app/lib/definitions';
import { requestPickUp } from '@/app/lib/actions';

export function RequestPickUp({ action }: { action: () => Promise<void> }) {
  return (
    <Tooltip color='primary' content='Request Pick Up'>
      <form action={action}>
        <SubmitButton isIconOnly={true} color='primary' variant='solid'>
          <MdScheduleSend size={16} />
        </SubmitButton>
      </form>
    </Tooltip>
  );
}
