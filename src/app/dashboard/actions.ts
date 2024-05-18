'use server';

import { OrderStatus } from '@prisma/client';
import { db } from '@/db';

export const updateOrderStatus = async ({
  id,
  status,
}: {
  id: string;
  status: OrderStatus;
}) => {
  await db.order.update({ where: { id }, data: { status } });
};
