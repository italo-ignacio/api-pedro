import type { Role } from '@prisma/client';

export interface tokenInput {
  id: number;
  name: string;
  email: string;
  role: Role;
}
