import type { Prisma } from '@prisma/client';

export const addressFindParams: Prisma.AddressSelect = {
  city: true,
  createdAt: true,
  finishedAt: true,
  id: true,
  municipality: true,
  number: true,
  state: true,
  street: true,
  updatedAt: true,
  zipCode: true
};
