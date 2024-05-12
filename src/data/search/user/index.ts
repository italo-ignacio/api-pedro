import type { Prisma } from '@prisma/client';

export const userFindParams: Prisma.UserSelect = {
  id: true,
  name: true,
  email: true,
  phone: true,
  role: true,
  finishedAt: true,
  createdAt: true,
  updatedAt: true
};
