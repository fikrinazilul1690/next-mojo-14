'use client';

import { Input, Textarea } from '@nextui-org/input';
import { Switch } from '@nextui-org/switch';
import { useFormState } from 'react-dom';
import { CreateAddressState, createAddress } from '@/app/lib/actions';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Location } from '@/app/lib/definitions';
import SelectLocation from './select-location';
import { useQueryClient } from '@tanstack/react-query';
import { useShipping } from '@/app/context/shipping-provider';
import { redirect, useSearchParams } from 'next/navigation';
import { SubmitButton } from '../submit-button';

type Props = {
  className?: string;
};

export default function CreateAddressForm({ className }: Props) {
  const searchParams = useSearchParams();
  const setAddressId = useShipping()((state) => state.setAddressId);
  const queryClient = useQueryClient();
  const initialState: CreateAddressState = {
    data: null,
    message: null,
    errors: {},
  };
  const [location, setLocation] = useState<Location | null>(null);
  const handleCreate = createAddress.bind(null, location);
  const [state, action] = useFormState(
    async (prevState: CreateAddressState, formData: FormData) => {
      const state = await handleCreate(prevState, formData);
      if (state.data) {
        setAddressId(state.data.id);
        await queryClient.invalidateQueries({ queryKey: ['address'] });
        const callbackUrl = searchParams.get('callbackUrl');
        if (callbackUrl) {
          redirect(callbackUrl);
        }
        redirect('/addresses');
      }

      return state;
    },
    initialState
  );

  useEffect(() => {
    if (!!state.message) {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <form className={className} action={action}>
      <Input
        type='text'
        name='contact_name'
        label='Name'
        variant='bordered'
        labelPlacement='outside'
        errorMessage={
          !!state.errors?.contact_name &&
          state.errors.contact_name.map((error: string) => (
            <p key={error}>{error}</p>
          ))
        }
      />
      <Input
        type='tel'
        name='contact_phone'
        label='Phone'
        variant='bordered'
        labelPlacement='outside'
        errorMessage={
          !!state.errors?.contact_phone &&
          state.errors.contact_phone.map((error: string) => (
            <p key={error}>{error}</p>
          ))
        }
      />
      <Input
        type='text'
        name='full_address'
        label='Full Address'
        variant='bordered'
        labelPlacement='outside'
        errorMessage={
          !!state.errors?.full_address &&
          state.errors.full_address.map((error: string) => (
            <p key={error}>{error}</p>
          ))
        }
      />
      <SelectLocation
        setLocation={setLocation}
        errorMessage={
          <>
            {!!state.errors?.area_id &&
              state.errors.area_id.map((error: string) => (
                <p key={error}>{error}</p>
              ))}
            {!!state.errors?.province &&
              state.errors.province.map((error: string) => (
                <p key={error}>{error}</p>
              ))}
            {!!state.errors?.city &&
              state.errors?.city.map((error: string) => (
                <p key={error}>{error}</p>
              ))}
            {!!state.errors?.district &&
              state.errors.district.map((error: string) => (
                <p key={error}>{error}</p>
              ))}
            {!!state.errors?.postal_code &&
              state.errors.postal_code.map((error: string) => (
                <p key={error}>{error}</p>
              ))}
            {!!state.errors?.location &&
              state.errors.location.map((error: string) => (
                <p key={error}>{error}</p>
              ))}
          </>
        }
      />
      <Switch value='true' className='self-start mt-6' name='is_primary'>
        Set as primary
      </Switch>
      <Textarea
        className='mt-6'
        variant='bordered'
        type='text'
        name='note'
        label='Note'
        errorMessage={
          !!state.errors?.note &&
          state.errors.note.map((error: string) => <p key={error}>{error}</p>)
        }
      />

      <SubmitButton color='primary' className='font-bold'>
        Create
      </SubmitButton>
    </form>
  );
}
