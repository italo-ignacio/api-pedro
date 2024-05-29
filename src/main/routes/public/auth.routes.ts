import { Router } from 'express';
import { authenticateController } from '@application/controller/auth';

export default (inputRouter: Router): void => {
  const router = Router();

  router.post('/login', authenticateController());

  inputRouter.use('/', router);
};
