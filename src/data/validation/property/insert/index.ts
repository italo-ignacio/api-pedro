import { AddressSchema } from '@data/validation/address';
import { numberNotRequired, numberRequired, stringRequired } from '@main/utils';
import { yup } from '@infra/yup';

export const insertPropertySchema = yup.object().shape({
  body: yup.object().shape({
    address: AddressSchema,
    name: stringRequired({
      english: 'name',
      length: 255,
      portuguese: 'nome'
    }),
    totalArea: numberRequired({
      english: 'total area',
      portuguese: 'area total'
    }),
    userId: numberNotRequired({
      english: 'user id',
      portuguese: 'id do usuário'
    })
  })
});
