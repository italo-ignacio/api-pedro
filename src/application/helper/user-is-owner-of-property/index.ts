import { DataSource } from '@infra/database';
import { Role } from '@prisma/client';
import type { Request } from 'express';

export const userIsOwnerOfProperty = async (
  request: Request,
  propertyId?: number
): Promise<boolean> => {
  if (request.user.role === Role.admin) return true;

  const property = await DataSource.property.findFirst({
    select: { id: true },
    where: {
      AND: {
        finishedAt: null,
        id: propertyId ?? Number(request.params.id),
        userId: Number(request.user.id)
      }
    }
  });

  if (property === null) return false;

  return true;
};
