import { PrismaClient } from '@prisma/client';
import { userSeed } from './user';

export const DataSource = new PrismaClient();

export const main = async (): Promise<void> => {
  try {
    await userSeed(DataSource);
  } catch (error) {
    throw error;
  }
};

main().catch((err) => {
  console.warn('Error While generating Seed: \n', err);
});
