import { Skeleton } from '@nextui-org/skeleton';
import { Card, CardHeader, CardBody, CardFooter } from '@nextui-org/card';
import { Button } from '@nextui-org/button';
import { Divider } from '@nextui-org/divider';

export function FeaturedProductCardSkeleton() {
  return (
    <Card shadow='sm' className='max-sm:w-3/4'>
      <CardBody className='overflow-visible p-0'>
        <Skeleton className='rounded-lg'>
          <div className='w-full object-cover h-[300px]'></div>
        </Skeleton>
      </CardBody>
      <CardFooter className='text-small justify-between'>
        <Skeleton className='rounded-md'>
          <div className='w-40 h-4'></div>
        </Skeleton>
      </CardFooter>
    </Card>
  );
}

export function ProductCardSkeleton() {
  return (
    <Card shadow='sm' className='max-sm:w-3/4'>
      <CardBody>
        <div className='flex gap-6 md:gap-4 items-center justify-start'>
          <Skeleton className='rounded-lg'>
            <div className='h-[200px] w-[200px] relative'></div>
          </Skeleton>

          <div className='flex-col flex justify-between gap-3 items-start'>
            <div className='flex flex-col gap-3'>
              <Skeleton className='rounded-sm w-fit'>
                <h1 className='font-semibold text-large text-foreground/90'>
                  Lorem, ipsum dolor.
                </h1>
              </Skeleton>
              <Skeleton className='rounded-sm w-fit'>
                <p className='text-small text-foreground/80'>Lorem.</p>
              </Skeleton>
              <Skeleton className='rounded-sm w-fit'>
                <h1 className='text-medium font-medium mt-2'>Lorem, ipsum.</h1>
              </Skeleton>
            </div>
            <Skeleton className='rounded-sm'>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Debitis, deleniti.
              </p>
            </Skeleton>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

export function FeaturedProductsListSkeleton({ limit }: { limit: number }) {
  return (
    <div className='gap-2 w-full grid grid-cols-1 min-h-[320px] items-center sm:grid-cols-3 mx-3 sm:mx-auto'>
      {[...Array(limit)].map((_, key) => (
        <FeaturedProductCardSkeleton key={key} />
      ))}
    </div>
  );
}

export function ProductsListSkeleton({ limit }: { limit: number }) {
  return (
    <div className='w-full flex flex-col gap-2'>
      {[...Array(limit)].map((_, key) => (
        <ProductCardSkeleton key={key} />
      ))}
    </div>
  );
}
export function AddressCardSkeleton() {
  return (
    <Card
      shadow='sm'
      classNames={{
        base: ['w-full'],
      }}
    >
      <CardBody>
        <div className='flex justify-between items-center'>
          <div className='flex flex-col gap-1 w-3/4'>
            <Skeleton className='rounded-lg self-start w-20 h-7'></Skeleton>
            <Skeleton className='rounded-lg w-3/4 h-7'></Skeleton>
            <Skeleton className='rounded-lg w-3/5 h-7'></Skeleton>
            <Skeleton className='rounded-lg w-3/6 h-7'></Skeleton>
            <div className='flex gap-3'>
              <Skeleton className='rounded-lg'>
                <Button
                  color='primary'
                  className='inline p-0 text-primary bg-transparent'
                  variant='solid'
                  disableRipple
                >
                  Ubah Alamat
                </Button>
              </Skeleton>
              <Skeleton className='rounded-lg'>
                <Button
                  color='primary'
                  className='inline p-0 text-primary bg-transparent'
                  variant='solid'
                  disableRipple
                >
                  Jadikan Alamat Utama & Pilih
                </Button>
              </Skeleton>
              <Skeleton className='rounded-lg'>
                <Button
                  color='danger'
                  className='inline p-0 text-danger bg-transparent'
                  variant='solid'
                  disableRipple
                >
                  Hapus
                </Button>
              </Skeleton>
            </div>
          </div>
          <Skeleton className='rounded-lg'>
            <Button color='primary' variant='solid'>
              Pilih
            </Button>
          </Skeleton>
        </div>
      </CardBody>
    </Card>
  );
}

export function AddressesListSkeleton() {
  return [...Array(3)].map((_, key) => <AddressCardSkeleton key={key} />);
}

export function SelectSkeleton() {
  return <Skeleton className='rounded-lg w-full h-[74px]' />;
}

export function CheckoutSummarySkeleton() {
  return (
    <div className='w-full flex flex-col gap-2 items-center'>
      <Skeleton className='rounded-sm w-full'>
        <div className='flex justify-between items-center'>
          <span className='font-bold'>Sub Total</span>
        </div>
      </Skeleton>
      <Skeleton className='rounded-sm w-full'>
        <div className='flex justify-between items-center'>
          <span className='font-bold'>Shipping Cost</span>
        </div>
      </Skeleton>
      <Skeleton className='rounded-sm w-full'>
        <div className='flex justify-between items-center'>
          <span className='font-bold'>Grand Total</span>
        </div>
      </Skeleton>
    </div>
  );
}

export function CheckoutButtonSkeleton() {
  return (
    <Skeleton className='rounded-md'>
      <Button>Checkout</Button>
    </Skeleton>
  );
}

const shimmer =
  'before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent';

export function CardSkeleton() {
  return (
    <div
      className={`${shimmer} relative overflow-hidden rounded-xl bg-gray-100 p-2 shadow-sm`}
    >
      <div className='flex p-4'>
        <div className='h-5 w-5 rounded-md bg-gray-200' />
        <div className='ml-2 h-6 w-16 rounded-md bg-gray-200 text-sm font-medium' />
      </div>
      <div className='flex items-center justify-center truncate rounded-xl bg-white px-4 py-8'>
        <div className='h-7 w-20 rounded-md bg-gray-200' />
      </div>
    </div>
  );
}

export function CardsSkeleton() {
  return (
    <>
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
    </>
  );
}

export function ProductSoldChartSkeleton() {
  return (
    <div className={`${shimmer} relative w-full overflow-hidden md:col-span-4`}>
      <div className='mb-4 h-8 w-36 rounded-md bg-gray-100' />
      <div className='rounded-xl bg-gray-100 p-4'>
        <div className='sm:grid-cols-13 mt-0 grid h-[410px] grid-cols-12 items-end gap-2 rounded-md  bg-white p-4 md:gap-4' />
        <div className='flex items-center pb-2 pt-6'>
          <div className='h-5 w-5 rounded-full bg-gray-200' />
          <div className='ml-2 h-4 w-20 rounded-md bg-gray-200' />
        </div>
      </div>
    </div>
  );
}

export function CountdownSkeleton() {
  return (
    <div className='flex items-center justify-center px-5 py-5'>
      <div>
        <h1 className='text-3xl text-center mb-3 font-extralight'>
          Please finish your payment in
        </h1>
        <div className='text-6xl text-center flex w-full items-center justify-center'>
          <div className='w-24 mx-1 p-2 rounded-lg bg-slate-200'>
            <div className='font-mono leading-none' x-text='hours'>
              00
            </div>
            <div className='font-mono uppercase text-sm leading-none'>
              Hours
            </div>
          </div>
          <div className='text-2xl mx-1 font-extralight'>:</div>
          <div className='w-24 mx-1 p-2 rounded-lg bg-slate-200'>
            <div className='font-mono leading-none' x-text='minutes'>
              00
            </div>
            <div className='font-mono uppercase text-sm leading-none'>
              Minutes
            </div>
          </div>
          <div className='text-2xl mx-1 font-extralight'>:</div>
          <div className='w-24 mx-1 p-2 rounded-lg bg-slate-200'>
            <div className='font-mono leading-none' x-text='seconds'>
              00
            </div>
            <div className='font-mono uppercase text-sm leading-none'>
              Seconds
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PaymentCardSkeleton() {
  return (
    <Card fullWidth shadow='sm'>
      <CardHeader className='justify-between items-center'>
        <Skeleton className='rounded-md'>
          <div className='font-bold h-4 w-24'></div>
        </Skeleton>
        <Skeleton className='rounded-md'>
          <div className='font-bold h-4 w-28'></div>
        </Skeleton>
      </CardHeader>
      <CardBody className='w-full space-x-4 h-24 flex flex-row items-center'>
        <Skeleton className='rounded-md'>
          <div className='w-24 h-12'></div>
        </Skeleton>
        <Divider orientation='vertical' />
        <div className='flex flex-col gap-1'>
          <Skeleton className='rounded-md'>
            <span className='text-foreground'>Payment Method</span>
          </Skeleton>
          <Skeleton className='rounded-md'>
            <span className='font-bold'>bank name</span>
          </Skeleton>
        </div>
        <Divider orientation='vertical' />
        <div className='flex flex-col gap-1 w-3/12'>
          <Skeleton className='rounded-md'>
            <span className='text-foreground'>Virtual Account</span>
          </Skeleton>
          <Skeleton className='rounded-md'>
            <span className='font-bold'>00000000000</span>
          </Skeleton>
        </div>
        <Divider orientation='vertical' />
        <div className='flex flex-col gap-1'>
          <Skeleton className='rounded-md'>
            <span className='text-foreground'>Payment Amount</span>
          </Skeleton>
          <Skeleton className='rounded-md'>
            <span className='font-bold'>Rp 00000000</span>
          </Skeleton>
        </div>
      </CardBody>
      <CardFooter className='justify-end items-center gap-3'>
        <Skeleton className='rounded-md'>
          <Button variant='solid' color='danger'>
            Details
          </Button>
        </Skeleton>
        <Skeleton className='rounded-md'>
          <Button variant='solid' color='danger'>
            Cancel
          </Button>
        </Skeleton>
      </CardFooter>
    </Card>
  );
}

export function ListPaymentSkeleton() {
  return (
    <div className='flex flex-col gap-3 w-full'>
      {[...Array(3)].map((_, key) => (
        <PaymentCardSkeleton key={key} />
      ))}
    </div>
  );
}
