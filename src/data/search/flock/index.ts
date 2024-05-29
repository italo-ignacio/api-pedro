import { propertyFindParams } from '../property';
import type { Prisma } from '@prisma/client';

export const flockFindParams = ({
  findProperty
}: {
  findProperty?: boolean;
}): Prisma.FlockSelect => ({
  id: true,
  name: true,
  totalCalves: true,
  totalCows: true,
  totalHeifers: true,
  totalOthers: true,
  user: true,
  property: findProperty ?? false ? { select: propertyFindParams } : false,
  finishedAt: true,
  createdAt: true,
  updatedAt: true
});
