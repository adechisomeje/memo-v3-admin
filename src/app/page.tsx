import LoginForm from '@/components/LoginForm'
import Image from 'next/image'

export default function Home() {
  return (
    <div className='container flex h-screen w-screen flex-col items-center justify-center'>
      <div className='mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]'>
        <div className='flex flex-col space-y-2 text-center'>
          <Image
            src='/memo-logo.svg'
            alt='MEMO Logo'
            width={64}
            height={64}
            className='mx-auto'
          />
          <h1 className='text-2xl font-semibold tracking-tight'>
            Welcome to MEMO Admin
          </h1>
          <p className='text-sm text-muted-foreground'>
            Enter your credentials to access the admin panel
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
