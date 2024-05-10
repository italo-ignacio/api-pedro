import { PrismaClient } from '@prisma/client';

export const userSeed = async (DataSource: PrismaClient): Promise<void> => {
  await DataSource.user.createMany({
    data: [
      {
        email: 'support@sp.senai.br',
        name: 'support',
        password: '$2b$10$0ovcoCD3z09ZlpzukHarHeKY.ioUWS9BjWs.ioy1Uod93j/8E1CYe',
        phone: '00000000000',
        role: 'admin'
      }
    ]
  });
};
