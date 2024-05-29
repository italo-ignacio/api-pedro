import { DataSource } from '@infra/database';
import { Role } from '@prisma/client';
import type { Request } from 'express';

export const userIsOwnerOfProperty = async (
  request: Request,
  propertyId?: number
): Promise<boolean> => {
  const AND = { finishedAt: null, id: propertyId ?? Number(request.params.id) };

  if (request.user.role !== Role.admin) Object.assign(AND, { userId: Number(request.user.id) });

  const property = await DataSource.property.findFirst({
    select: { id: true },
    where: {
      AND
    }
  });

  if (property === null) return false;

  return true;
};
