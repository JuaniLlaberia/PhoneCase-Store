'use client';

import Confetti from 'react-dom-confetti';
import { useEffect, useState } from 'react';
import { Configuration } from '@prisma/client';
import { ArrowRight, Check } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';

import Phone from '@/components/Phone';
import { COLORS, FINISHES, MODELS } from '@/validators/option-validator';
import { cn } from '@/lib/utils';
import { formatPrice } from '@/lib/priceFormatter';
import { BASE_PRICE, PRODUCT_PRICES } from '@/config/products';
import { Button } from '@/components/ui/button';
import { createCheckoutSession } from './actions';
import { useToast } from '@/components/ui/use-toast';
import LoginModal from '@/components/LoginModal';

const DesignPreview = ({ configuration }: { configuration: Configuration }) => {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useKindeBrowserClient();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  useEffect(() => setShowConfetti(true), []);

  const { color, model, finish, material } = configuration;
  const tw = COLORS.find(supportedColor => supportedColor.value === color)?.tw;
  const { label: modelLabel } = MODELS.options.find(
    ({ value }) => value === model
  )!;
  const { label: finishLabel } = FINISHES.options.find(
    ({ value }) => value === finish
  )!;

  let totalPrice = BASE_PRICE;
  if (material === 'polycarbonate')
    totalPrice += PRODUCT_PRICES.material.polycarbonate;
  if (finish === 'textured') totalPrice += PRODUCT_PRICES.finish.textured;

  const { mutate: createPaymentSession, isPending } = useMutation({
    mutationKey: ['get-checkout-session'],
    mutationFn: createCheckoutSession,
    onSuccess: ({ url }) => {
      if (url) {
        router.push(url);
      } else {
        throw new Error('Unable to retrieve payment URL');
      }
    },
    onError: () => {
      toast({
        title: 'Something wen wrong',
        description: 'There was an error on our end. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const handleCheckout = () => {
    if (user) {
      //Create payment session
      createPaymentSession({ configId: configuration.id });
    } else {
      //Save config
      localStorage.setItem('configurationId', configuration.id);
      //Need to log in
      setIsModalOpen(true);
    }
  };

  return (
    <>
      <div
        className='pointer-events-none select-none absolute inset-0 overflow-hidden flex justify-center'
        aria-hidden='true'
      >
        <Confetti
          active={showConfetti}
          config={{
            elementCount: 200,
            spread: 90,
          }}
        />
      </div>

      <LoginModal isOpen={isModalOpen} toggleOpen={setIsModalOpen} />

      <div className='mt-20 grid grid-cols-1 text-sm sm:grid-cols-12 sm:grid-rows-1 sm:gap-x-6 md:gap-x-8 lg:gap-x-12'>
        <div className='sm:col-span-4 md:col-span-3 md:row-span-2 md:row-end-2'>
          <Phone
            imgSrc={configuration.croppedImageUrl!}
            className={cn(`bg-${tw}`)}
          />
        </div>

        <div className='mt-6 sm:col-span-9 sm:mt-0 md:row-end-1'>
          <h3 className='text-3xl font-bold tracking-tight text-gray-900'>
            Your {modelLabel} Case
          </h3>
          <div className='mt-3 flex items-center gap-1.5 text-base'>
            <Check className='size-4 text-green-500' />
            In stock and ready to ship
          </div>
        </div>
        <div className='sm:col-span-12 md:col-span-9 text-base'>
          <div className='grid grid-cols-1 gap-y-8 border-b border-gray-200 py-8 sm:grid-cols-2 ms:gap-x-6 sm:py-6 md:py-10'>
            <div>
              <p className='font-medium text-zinc-950'>Highlights</p>
              <ol className='mt-3 text-zinc-700 list-disc list-inside'>
                <li>Wireless charging compatible</li>
                <li>TPU shock absorption</li>
                <li>Packaging made from recycled materials</li>
                <li>5 year print warranty</li>
              </ol>
            </div>
            <div>
              <p className='font-medium text-zinc-950'>Materials</p>
              <ol className='mt-3 text-zinc-700 list-disc list-inside'>
                <li>{finishLabel}</li>
                <li>High-quality, durable material</li>
                <li>Scratch and fingerprint resistant coating</li>
              </ol>
            </div>
          </div>

          <div className='mt-8'>
            <div className='bg-gray-50 p-6 sm:rounded-lg sm:p-8'>
              <div className='flow-root text-sm'>
                <div className='flex items-center justify-between py-1 mt-2'>
                  <p className='text-gray-600'>Base price</p>
                  <p className='text-gray-900 font-medium'>
                    {formatPrice(BASE_PRICE / 100)}
                  </p>
                </div>
                {finish === 'textured' ? (
                  <div className='flex items-center justify-between py-1 mt-2'>
                    <p className='text-gray-600'>Textured finish</p>
                    <p className='text-gray-900 font-medium'>
                      {formatPrice(PRODUCT_PRICES.finish.textured / 100)}
                    </p>
                  </div>
                ) : null}
                {material === 'polycarbonate' ? (
                  <div className='flex items-center justify-between py-1 mt-2'>
                    <p className='text-gray-600'>Soft polycarbonate</p>
                    <p className='text-gray-900 font-medium'>
                      {formatPrice(PRODUCT_PRICES.material.polycarbonate / 100)}
                    </p>
                  </div>
                ) : null}

                <div className='my-2 h-px bg-gray-200' />
                <div className='flex items-center justify-between py-2'>
                  <p className='text-gray-900 font-semibold'>Order total</p>
                  <p className='text-gray-900 font-semibold'>
                    {formatPrice(totalPrice / 100)}
                  </p>
                </div>
              </div>
            </div>
            <div className='mt-8 flex justify-end pb-12'>
              <Button
                isLoading={isPending}
                loadingText='Redirecting'
                disabled={isPending}
                className='px-4 sm:px-6 lg:px-8'
                onClick={handleCheckout}
              >
                Check out <ArrowRight className='size-4 ml-1.5 inline' />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DesignPreview;
