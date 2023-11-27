'use client';
import { Input, Textarea } from '@nextui-org/input';
import { Button } from '@nextui-org/button';
import { useFormState } from 'react-dom';
import { CreateAddressState, updateAddress } from '@/app/lib/actions';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { CustomerAddress, Location } from '@/app/lib/definitions';
import SelectLocation from './select-location';
import { useQueryClient } from '@tanstack/react-query';
import { redirect } from 'next/navigation';
import { SubmitButton } from '../submit-button';

type Props = {
  className?: string;
  address: CustomerAddress;
};

export default function UpdateAddressForm({ className, address }: Props) {
  const locationName = `${address.district}, ${address.city}, ${address.district}, ${address.district}. ${address.postal_code}`;
  const queryClient = useQueryClient();
  const initialState: CreateAddressState = {
    data: null,
    message: null,
    errors: {},
  };
  const [location, setLocation] = useState<Location | null>({
    area_id: address.area_id,
    city: address.city,
    province: address.province,
    district: address.district,
    name: locationName,
    postal_code: address.postal_code,
  });
  const handleUpdate = updateAddress.bind(null, address.id, location);
  const [state, action] = useFormState(
    async (prevState: CreateAddressState, formData: FormData) => {
      const state = await handleUpdate(prevState, formData);
      if (state.data) {
        await queryClient.invalidateQueries({ queryKey: ['address'] });
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
        defaultValue={address.contact_name}
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
        defaultValue={address.contact_phone}
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
        defaultValue={address.address}
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
        value={locationName}
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
      <Textarea
        defaultValue={address.note}
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
        Update
      </SubmitButton>
    </form>
  );
}
