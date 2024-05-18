'use client';

import { OrderStatus } from '@prisma/client';
import { useMutation } from '@tanstack/react-query';
import { Check, ChevronsUpDown } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { updateOrderStatus } from './actions';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';

const LABEL_MAP: Record<keyof typeof OrderStatus, string> = {
  awaiting_shipment: 'Pending',
  fulfilled: 'Fulfilled',
  shipped: 'Shipped',
};

const StatusSelect = ({
  orderId,
  orderStatus,
}: {
  orderId: string;
  orderStatus: OrderStatus;
}) => {
  const { toast } = useToast();
  const router = useRouter();
  const { mutate: changeStatus } = useMutation({
    mutationKey: ['change-order-status'],
    mutationFn: updateOrderStatus,
    onSuccess: () => {
      toast({
        title: 'Updated successfully',
        description: 'The order status was changed.',
        variant: 'default',
      });
      router.refresh();
    },
    onError: () => {
      toast({
        title: 'Something went wrong',
        description: 'Failed to change the order status.',
        variant: 'destructive',
      });
    },
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='outline' className='w-52 flex justify-between'>
          {LABEL_MAP[orderStatus]}
          <ChevronsUpDown className='size-4 ml-2 shrink-0 opacity-50' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='p-0'>
        {Object.keys(OrderStatus).map(status => (
          <DropdownMenuItem
            key={status}
            className={cn(
              'flex text-sm gap-1 items-center p-2.5 cursor-default hover:bg-zinc-100',
              {
                'bg-zinc-100': orderStatus === status,
              }
            )}
            onClick={() =>
              changeStatus({ id: orderId, status: status as OrderStatus })
            }
          >
            <Check
              className={cn(
                'mr-2 size-4 text-primary',
                orderStatus === status ? 'opacity-100' : 'opacity-0'
              )}
            />
            {LABEL_MAP[status as OrderStatus]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default StatusSelect;
