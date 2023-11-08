import LoginForm from '@/app/ui/auth/login-form';

export default function Page({
  searchParams,
}: {
  searchParams: { callbackUrl?: string | string[] };
}) {
  let callbackUrl =
    typeof searchParams.callbackUrl === 'string'
      ? searchParams.callbackUrl
      : Array.isArray(searchParams.callbackUrl)
      ? searchParams.callbackUrl.slice(-1)[0]
      : '/';

  if (
    !callbackUrl.startsWith('/') &&
    !callbackUrl.startsWith(`${process.env.AUTH_URL}/`)
  ) {
    callbackUrl = '/';
  }

  return (
    <>
      <div className='h-14 bg-[#D2D2D2] bg-opacity-[40%] flex justify-start items-center'>
        <h4 className='font-bold text-md ml-[50px]'>Akun / Login</h4>
      </div>
      <main className='flex justify-center items-center my-[50px]'>
        <div className='lg:w-[600px] rounded-lg border border-solid border-[#D9D9D9]'>
          <div className='mx-[97px] my-[93px]'>
            <h1 className='text-2xl font-bold mt-[93px] text-center mb-7'>
              Login
            </h1>
            <LoginForm
              callbackURL={callbackUrl}
              className='flex flex-col justify-between gap-7'
            />
          </div>
        </div>
      </main>
    </>
  );
}
