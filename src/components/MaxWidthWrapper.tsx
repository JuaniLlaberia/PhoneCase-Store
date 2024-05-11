import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type MaxWidthWrapperType = {
  className?: string;
  children: ReactNode;
};

const MaxWidthWrapper = ({ className, children }: MaxWidthWrapperType) => {
  return (
    <div
      className={cn(
        'h-full mx-auto w-full max-w-screen-xl px-2.5 md:px-20',
        className
      )}
    >
      {children}
    </div>
  );
};

export default MaxWidthWrapper;
