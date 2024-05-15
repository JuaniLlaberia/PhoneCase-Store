import Image from 'next/image';

import type { Dispatch, SetStateAction } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { buttonVariants } from './ui/button';
import { LoginLink, RegisterLink } from '@kinde-oss/kinde-auth-nextjs';

const LoginModal = ({
  isOpen,
  toggleOpen,
}: {
  isOpen: boolean;
  toggleOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <Dialog onOpenChange={toggleOpen} open={isOpen}>
      <DialogContent className='absolute z-[99999]'>
        <DialogHeader>
          <div className='relative mx-auto size-24 mb-2'>
            <Image
              src='/snake-1.png'
              alt='snake image logo'
              className='object-contain'
              fill
            />
          </div>
          <DialogTitle className='text-3xl text-center font-bold tracking-tight text-gray-900'>
            Log in to continue
          </DialogTitle>
          <DialogDescription className='text-base text-center py-2'>
            <span className='font-medium text-zinc-900'>
              Your configuration was saved!
            </span>{' '}
            Please login or create and account to complete your purchase.
          </DialogDescription>
        </DialogHeader>
        <div className='grid grid-cols-2 gap-6 divide-x divide-gray-200'>
          <LoginLink className={buttonVariants({ variant: 'outline' })}>
            Log In
          </LoginLink>
          <RegisterLink className={buttonVariants({ variant: 'default' })}>
            Sign Up
          </RegisterLink>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;
