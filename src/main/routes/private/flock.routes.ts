import { Router } from 'express';
import {
  findFlockController,
  findOneFlockController,
  insertFlockController,
  updateFlockController
} from '@application/controller/flock';

export default (inputRouter: Router): void => {
  const router = Router();

  router.get('', findFlockController());
  router.post('', insertFlockController());
  router.get('/:id', findOneFlockController());
  router.put('/:id', updateFlockController());

  inputRouter.use('/flock', router);
};
