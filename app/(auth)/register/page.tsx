import RegisterForm from '@/app/ui/auth/register-form';

export default function Page() {
  return (
    <main className='flex justify-center items-center my-[50px]'>
      <div className='lg:w-[600px] rounded-lg border border-solid border-[#D9D9D9]'>
        <div className='mx-[97px] my-[93px]'>
          <h1 className='text-2xl font-bold mt-[93px] text-center mb-7'>
            Register
          </h1>
          <RegisterForm className='flex flex-col justify-between gap-7' />
        </div>
      </div>
    </main>
  );
}
