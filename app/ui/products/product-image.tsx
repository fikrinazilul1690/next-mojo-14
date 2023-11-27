'use client';
import { useReducer, useState } from 'react';
import { Card, CardBody, CardFooter, CardHeader } from '@nextui-org/card';
import { Tabs, Tab } from '@nextui-org/tabs';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { Tb3DRotate } from 'react-icons/tb';
import { BsFillImageFill } from 'react-icons/bs';
import { FileResponse, Product } from '@/app/lib/definitions';

type Props = {
  product: Product;
};

type SelectedState = FileResponse;

type SelectedAction = {
  type: SelectedActionKind;
  payload: FileResponse;
};

enum SelectedActionKind {
  SetImage = 'SET_IMAGE',
}

function reducer(state: SelectedState, action: SelectedAction) {
  const { type, payload } = action;
  switch (type) {
    case SelectedActionKind.SetImage:
      return payload;
    default:
      return state;
  }
}

export default function ProductImages({ product: { images, model } }: Props) {
  const initialState: FileResponse = images.filter(
    (image) => image.order === 0
  )[0];
  const [state, dispatch] = useReducer(reducer, initialState);
  const [selected, setSelected] = useState('gambar');
  const Model = dynamic(() => import('./product-model'), { ssr: false });

  return (
    <Card
      className='gap-3 w-[240px] max-sm:w-[180px] h-[200px] sm:h-[400px] xl:w-[348px]'
      shadow='none'
      radius='none'
    >
      <CardHeader className='p-0'>
        <Tabs
          selectedKey={selected}
          onSelectionChange={(key) => setSelected(key.toString())}
          variant='solid'
          size='lg'
          fullWidth
          aria-label='Tabs variants'
        >
          <Tab
            key='gambar'
            title={
              <div className='flex items-center space-x-2'>
                <BsFillImageFill size={18} />
                <span>Gambar</span>
              </div>
            }
          />
          <Tab
            key='model'
            title={
              <div className='flex items-center space-x-2'>
                <Tb3DRotate size={18} />
                <span>3D Model</span>
              </div>
            }
          />
        </Tabs>
      </CardHeader>
      <CardBody className='p-0 w-full h-1/2 relative bg-foreground-200 rounded-xl'>
        {selected === 'gambar' ? (
          <Image
            alt={state.name}
            className='object-contain'
            priority
            src={state.url}
            fill
          />
        ) : (
          <Model
            className='w-full h-full'
            src={model?.url ?? ''}
            alt={model?.name ?? ''}
          />
        )}
      </CardBody>
      {selected === 'gambar' && (
        <CardFooter className='p-0 justify-start justify-self-end gap-2'>
          {images.map((image) => (
            <div
              key={image.id}
              onClick={() => {
                dispatch({ type: SelectedActionKind.SetImage, payload: image });
              }}
              className={`w-[32%] h-20 relative cursor-pointer ${
                image.id === state.id ? 'border-2 border-default' : ''
              }`}
            >
              <Image
                alt={image.name}
                className='object-contain'
                src={image.url}
                fill
              />
            </div>
          ))}
        </CardFooter>
      )}
    </Card>
  );
}
