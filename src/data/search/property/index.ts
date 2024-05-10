/* eslint-disable sort-keys-fix/sort-keys-fix */
import { addressFindParams } from '../address';
import { userFindParams } from '../user';
import type { Prisma } from '@prisma/client';

export const propertyFindParams: Prisma.PropertySelect = {
  id: true,
  name: true,
  totalArea: true,
  address: {
    select: addressFindParams
  },
  addressId: true,
  user: {
    select: userFindParams
  },
  userId: true,
  finishedAt: true,
  createdAt: true,
  updatedAt: true
};
