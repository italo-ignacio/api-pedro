import { numberNotRequired, stringNotRequired } from '@main/utils';
import { yup } from '@infra/yup';

export const updatePropertySchema = yup.object().shape({
  body: yup.object().shape({
    name: stringNotRequired({
      english: 'name',
      length: 255,
      portuguese: 'nome'
    }),
    totalArea: numberNotRequired({
      english: 'total area',
      portuguese: 'area total'
    })
  })
});
