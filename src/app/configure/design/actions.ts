'use server';

import {
  CaseMaterial,
  CaseColor,
  CaseFinish,
  PhoneModel,
} from '@prisma/client';
import { db } from '@/db';

export type saveConfigType = {
  color: CaseColor;
  finish: CaseFinish;
  material: CaseMaterial;
  model: PhoneModel;
  configId: string;
};

export const saveConfig = async ({
  color,
  finish,
  material,
  model,
  configId,
}: saveConfigType) => {
  await db.configuration.update({
    where: { id: configId },
    data: { color, finish, material, model },
  });
};
