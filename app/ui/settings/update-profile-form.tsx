'use client';
import { useUser } from '@/app/context/user-provider';
import { Button } from '@nextui-org/button';
import { Input } from '@nextui-org/input';
import Image from 'next/image';
import { Select, SelectItem } from '@nextui-org/select';
import {
  UpdateProfileState,
  UploadState,
  saveProfilePicture,
  updateUserProfile,
  uploadProfilePicture,
} from '@/app/lib/actions';
import { useFormState } from 'react-dom';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { SubmitButton } from '../submit-button';

const genders = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
];

export default function UpdateProfileForm() {
  const [user, updateUser] = useUser();
  const initialUploadState: UploadState = {
    message: null,
    status: 'iddle',
    data: null,
  };
  const initialState: UpdateProfileState = {
    message: null,
    status: 'iddle',
    errors: {},
  };
  const [state, action] = useFormState(
    async (prevState: UpdateProfileState, formData: FormData) => {
      console.log('run');
      updateUser((prevData) => {
        if (prevData) {
          return {
            ...prevData,
            name: formData.get('name') as string,
            phone: formData.get('phone') as string,
            gender: formData.get('gender') as string,
            birthdate: formData.get('birthdate') as string,
          };
        }
        return prevData;
      });
      return await updateUserProfile(prevState, formData);
    },
    initialState
  );
  const [imageState, uploadAction] = useFormState(
    async (prevState: UploadState, formData: FormData) => {
      const upload = await uploadProfilePicture(prevState, formData);
      updateUser((prevData) => {
        if (prevData && upload.data) {
          return {
            ...prevData,
            profile_picture: {
              name: upload.data.file_name,
              uploaded_at: upload.data.uploaded_at,
              url: upload.data.image_url,
            },
          };
        }
        return prevData;
      });

      if (upload.status === 'success') {
        await saveProfilePicture(upload.data?.id ?? '');
      }
      return upload;
    },
    initialUploadState
  );

  useEffect(() => {
    if (state.message) {
      if (state.status === 'error') {
        toast.error(state.message);
      }
      if (state.status === 'success') {
        toast.success(state.message);
      }
    }
  }, [state]);

  useEffect(() => {
    if (imageState.message) {
      if (imageState.status === 'error') {
        toast.error(imageState.message);
      }
      if (imageState.status === 'success') {
        toast.success(imageState.message);
      }
    }
  }, [imageState]);

  return (
    <form
      className='grid grid-cols-12 grid-rows-5 gap-x-4 gap-y-2'
      action={action}
    >
      <div className='flex flex-col w-full h-full items-center gap-2 col-span-3 row-span-3'>
        <div className='relative w-full h-full'>
          <Image
            fill
            className='object-contain rounded-md border-1 border-slate-200'
            alt={`${user?.name ?? 'user'}'s profile picture`}
            src={user?.profile_picture?.url ?? '/default-user.jpg'}
          />
          <input
            hidden
            type='file'
            name='profilePicture'
            id='profilePicture'
            onChange={(e) => {
              const formData = new FormData();
              if (e.target.files) {
                formData.append('file', e.target.files[0]);
              }
              uploadAction(formData);
            }}
          />
        </div>
        <Button
          fullWidth
          as='label'
          radius='sm'
          variant='bordered'
          htmlFor='profilePicture'
        >
          Choose File
        </Button>
      </div>
      <Input
        name='name'
        label='Name'
        variant='bordered'
        labelPlacement='outside'
        placeholder='Enter your name'
        className='col-span-9'
        defaultValue={user?.name}
        errorMessage={
          state.errors?.name &&
          state.errors.name.map((error: string) => <p key={error}>{error}</p>)
        }
        type='text'
      />
      <Input
        name='phone'
        label='Phone'
        variant='bordered'
        labelPlacement='outside'
        placeholder='Enter your phone'
        className='col-span-9'
        defaultValue={user?.phone}
        errorMessage={
          state.errors?.phone &&
          state.errors.phone.map((error: string) => <p key={error}>{error}</p>)
        }
        type='tel'
      />
      <Select
        label='Gender'
        name='gender'
        classNames={{
          value: 'text-black',
        }}
        selectionMode='single'
        defaultSelectedKeys={user?.gender ? new Set([user.gender]) : undefined}
        placeholder='Select a gender'
        variant='bordered'
        labelPlacement='outside'
        className='col-span-9'
        errorMessage={
          state.errors?.gender &&
          state.errors.gender.map((error: string) => <p key={error}>{error}</p>)
        }
      >
        {genders.map((gender) => (
          <SelectItem key={gender.value} value={gender.value}>
            {gender.label}
          </SelectItem>
        ))}
      </Select>
      <Input
        name='birthdate'
        label='Birthdate'
        variant='bordered'
        labelPlacement='outside'
        placeholder='Enter your name'
        className='col-span-full'
        defaultValue={user?.birthdate}
        errorMessage={
          state.errors?.birthdate &&
          state.errors.birthdate.map((error: string) => (
            <p key={error}>{error}</p>
          ))
        }
        type='date'
      />
      <SubmitButton
        radius='sm'
        variant='solid'
        color='primary'
        className='row-span-1 col-start-6 col-end-8'
      >
        Save
      </SubmitButton>
    </form>
  );
}
