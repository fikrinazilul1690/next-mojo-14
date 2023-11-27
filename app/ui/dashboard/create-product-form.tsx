'use client';
import React, { Key, useState } from 'react';
import SelectCategory from './select-category';
import {
  Button,
  Switch,
  cn,
  Autocomplete,
  AutocompleteSection,
  AutocompleteItem,
  Input,
  Textarea,
  Select,
  SelectItem,
  Chip,
} from '@nextui-org/react';
import { SelectionProduct, Variant } from '@/app/lib/definitions';
import { colorData } from '@/app/lib/data';

const listUnitDimension = ['cm', 'm', 'dm'];
const listUnitWeight = ['gr', 'kg'];
const listSelectionType = ['color', 'material'];

export default function CreateProductForm() {
  const [customizable, setCustomizable] = useState(false);
  const [selections, setSelections] = useState<SelectionProduct[]>([]);
  const [color, setColor] = useState('');
  const [hexCode, setHexCode] = useState('#fff');

  console.log(selections);
  return (
    <form action='' className='flex flex-col gap-4 w-full'>
      <Input
        type='text'
        label='Product Name'
        placeholder='Enter Product Name'
        labelPlacement='outside'
        radius='sm'
        name='name'
      />
      <Textarea
        name='description'
        label='Description'
        labelPlacement='outside'
        placeholder='Enter your description'
      />
      <SelectCategory />
      <div className='flex flex-col gap-4'>
        <span className='text-sm'>Dimension</span>
        <div className='w-full grid grid-cols-2 grid-rows-2 items-center gap-4'>
          <Input
            label='Product Width'
            type='number'
            placeholder='Enter Product Width'
            labelPlacement='inside'
            radius='sm'
            name='width'
          />
          <Input
            label='Product Length'
            type='number'
            placeholder='Enter Product Length'
            labelPlacement='inside'
            radius='sm'
            name='length'
          />
          <Input
            type='number'
            label='Product Height'
            placeholder='Enter Product Height'
            labelPlacement='inside'
            radius='sm'
            name='height'
          />
          <Select
            label='Unit'
            labelPlacement='inside'
            name='unitDimension'
            placeholder='Select an unit dimension'
            size='md'
          >
            {listUnitDimension.map((unit) => (
              <SelectItem key={unit} value={unit}>
                {unit}
              </SelectItem>
            ))}
          </Select>
        </div>
      </div>
      <div className='flex flex-col gap-4'>
        <span className='text-sm'>Weight</span>
        <div className='w-full grid grid-cols-2 items-center gap-4'>
          <Input
            label='Product Weight'
            type='number'
            placeholder='Enter Product Weight'
            labelPlacement='inside'
            radius='sm'
            name='weight'
          />
          <Select
            size='md'
            label='Unit'
            labelPlacement='inside'
            name='unitWeight'
            placeholder='Select unit weight'
          >
            {listUnitWeight.map((unit) => (
              <SelectItem key={unit} value={unit}>
                {unit}
              </SelectItem>
            ))}
          </Select>
        </div>
      </div>
      <div className='flex flex-col gap-4'>
        <span className='text-sm'>Product Images</span>
        <input type='file' accept='.jpg, .jpeg, .png' name='images' multiple />
      </div>
      <div className='flex flex-col gap-4'>
        <span className='text-sm'>Product Model</span>
        <input type='file' accept='.glb' name='model' />
      </div>
      <div className='flex gap-4 w-full'>
        <Switch
          classNames={{
            base: cn(
              'inline-flex flex-row-reverse w-full max-w-full bg-content1 hover:bg-content2 items-center',
              'justify-between cursor-pointer rounded-lg gap-2 p-4 border-2 border-foreground-600',
              'data-[selected=true]:border-primary'
            ),
            wrapper: 'p-0 h-4 overflow-visible bg-foreground-600',
            thumb: cn(
              'w-6 h-6 border-2 shadow-lg border-foreground-600',
              'group-data-[hover=true]:border-primary',
              //selected
              'group-data-[selected=true]:ml-6',
              // pressed
              'group-data-[pressed=true]:w-7',
              'group-data-[selected]:group-data-[pressed]:ml-4'
            ),
          }}
          name='featured'
        >
          <div className='flex flex-col gap-1'>
            <p className='text-medium'>Featured Product</p>
            <p className='text-tiny text-default-600'>
              tetapkan produk sebagai produk unggulan
            </p>
          </div>
        </Switch>
        <Switch
          isSelected={customizable}
          onValueChange={setCustomizable}
          classNames={{
            base: cn(
              'inline-flex flex-row-reverse w-full max-w-full bg-content1 hover:bg-content2 items-center',
              'justify-between cursor-pointer rounded-lg gap-2 p-4 border-2 border-foreground-600',
              'data-[selected=true]:border-primary'
            ),
            wrapper: 'p-0 h-4 overflow-visible bg-foreground-600',
            thumb: cn(
              'w-6 h-6 border-2 shadow-lg border-foreground-600',
              'group-data-[hover=true]:border-primary',
              //selected
              'group-data-[selected=true]:ml-6',
              // pressed
              'group-data-[pressed=true]:w-7',
              'group-data-[selected]:group-data-[pressed]:ml-4'
            ),
          }}
          name='customizable'
        >
          <div className='flex flex-col gap-1'>
            <p className='text-medium'>Customization</p>
            <p className='text-tiny text-default-400'>
              jika produk dapat disesuaiakan, maka produk akan ditetapkan
              sebagai pre-order dan memiliki lebih dari satu varian
            </p>
          </div>
        </Switch>
      </div>
      {!customizable ? (
        <Input
          label='Product Price'
          type='number'
          placeholder='Enter Product Price'
          labelPlacement='outside'
          radius='sm'
          name='price'
        />
      ) : null}
      {!customizable ? (
        <Input
          label='Product Stock'
          type='number'
          placeholder='Enter Product Stock'
          labelPlacement='outside'
          radius='sm'
          name='stock'
        />
      ) : null}
      <div>
        <span className='text-sm'>Variants</span>
        {selections.length === 0 ? (
          <Button
            onClick={() => setSelections([{ name: '', options: [] }])}
            isDisabled={selections.length !== 0}
          >
            Add Variants
          </Button>
        ) : (
          <Button
            onClick={() => setSelections([])}
            isDisabled={selections.length === 0}
          >
            Remove Variants
          </Button>
        )}
        {selections.map((selection, parentKey) => (
          <div key={selection.name}>
            <Select
              label='Unit'
              labelPlacement='inside'
              name='unitDimension'
              placeholder='Select an unit dimension'
              size='md'
              selectionMode='single'
              selectedKeys={
                selection.name !== '' ? new Set([selection.name]) : new Set()
              }
              disabledKeys={
                new Set(
                  selections
                    .filter((sel) => sel.name)
                    .map((sel) => {
                      return sel.name;
                    })
                )
              }
            >
              {listSelectionType.map((unit) => (
                <SelectItem
                  onPress={() => {
                    const newValue = selections.map((item, childKey) => {
                      if (parentKey === childKey) {
                        item.name = unit;
                        item.options = [];
                      }
                      return item;
                    });
                    setSelections(newValue);
                  }}
                  key={unit}
                  value={unit}
                >
                  {unit}
                </SelectItem>
              ))}
            </Select>
            {selection.name === 'color' ? (
              <div className='flex flex-col gap-4'>
                <div className='flex gap-2'>
                  {selection.options.map((option, index) => (
                    <Chip key={index} onClose={() => {}} variant='flat'>
                      {option.value}
                    </Chip>
                  ))}
                </div>
                <Autocomplete label='Select an animal' className='max-w-xs'>
                  {colorData.map((color) => (
                    <AutocompleteItem key={color.name} value={color.name}>
                      <div className='flex gap-2'>
                        <span
                          className={`block w-4 h-4 bg-[${color.hex}]`}
                        ></span>
                        <span>{color.name}</span>
                      </div>
                    </AutocompleteItem>
                  ))}
                </Autocomplete>
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </form>
  );
}
