import { DataSource } from '@infra/database';
import { Role } from '@prisma/client';
import type { Request } from 'express';

export const userIsOwnerOfFlock = async (request: Request, flockId?: number): Promise<boolean> => {
  if (request.user.role === Role.admin) return true;

  const flock = await DataSource.flock.findFirst({
    select: { id: true },
    where: {
      AND: {
        finishedAt: null,
        id: flockId ?? Number(request.params.id),
        userId: Number(request.user.id)
      }
    }
  });

  if (flock === null) return false;

  return true;
};
