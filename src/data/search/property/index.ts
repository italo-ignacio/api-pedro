import { addressFindParams } from '../address';
import { userFindParams } from '../user';
import type { Prisma } from '@prisma/client';

export const propertyFindParams: Prisma.PropertySelect = {
  id: true,
  name: true,
  totalArea: true,
  address: { select: addressFindParams },
  user: { select: userFindParams },
  finishedAt: true,
  createdAt: true,
  updatedAt: true
};
