import { Router } from 'express';
import {
  deletePropertyController,
  findOnePropertyController,
  findPropertyController,
  insertPropertyController,
  updatePropertyController
} from '@application/controller/property';

export default (inputRouter: Router): void => {
  const router = Router();

  router.get('', findPropertyController());
  router.post('', insertPropertyController());
  router.get('/:id', findOnePropertyController());
  router.put('/:id', updatePropertyController());
  router.delete('/:id', deletePropertyController());

  inputRouter.use('/property', router);
};
