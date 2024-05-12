import type { Prisma } from '@prisma/client';

export const addressFindParams: Prisma.AddressSelect = {
  id: true,
  city: true,
  municipality: true,
  number: true,
  state: true,
  street: true,
  zipCode: true,
  finishedAt: true,
  createdAt: true,
  updatedAt: true
};
