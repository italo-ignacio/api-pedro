import type { Prisma } from '@prisma/client';

export const userFindParams: Prisma.UserSelect = {
  createdAt: true,
  email: true,
  finishedAt: true,
  id: true,
  name: true,
  phone: true,
  role: true,
  updatedAt: true
};
