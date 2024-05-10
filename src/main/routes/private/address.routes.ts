import { Router } from 'express';
import {
  findAddressController,
  findOneAddressController,
  updateAddressController
} from '@application/controller/address';

export default (inputRouter: Router): void => {
  const router = Router();

  router.get('', findAddressController());
  router.get('/:id', findOneAddressController());
  router.put('/:id', updateAddressController());

  inputRouter.use('/address', router);
};
