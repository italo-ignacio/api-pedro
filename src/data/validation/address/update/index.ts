import { numberNotRequired, stringNotRequired, zipCodeNotRequired } from '@main/utils';
import { yup } from '@infra/yup';

export const updateAddressSchema = yup.object().shape({
  body: yup.object().shape({
    city: stringNotRequired({
      english: 'city',
      length: 50,
      portuguese: 'cidade'
    }),
    municipality: stringNotRequired({
      english: 'municipality',
      length: 50,
      portuguese: 'município'
    }),
    number: numberNotRequired({
      english: 'number',
      portuguese: 'número'
    }),
    state: stringNotRequired({
      english: 'state',
      length: 50,
      portuguese: 'estado'
    }),
    street: stringNotRequired({
      english: 'street',
      length: 255,
      portuguese: 'rua'
    }),
    zipCode: zipCodeNotRequired()
  })
});
