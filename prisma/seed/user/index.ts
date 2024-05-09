import { PrismaClient } from '@prisma/client';

export const userSeed = async (DataSource: PrismaClient): Promise<void> => {
  await DataSource.user.createMany({
    data: [
      {
        email: 'teste@teste.com',
        name: '13',
        password: '13'
      }
    ]
  });
};
