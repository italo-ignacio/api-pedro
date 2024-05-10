import { numberRequired, stringRequired, zipCodeRequired } from '@main/utils';
import { yup } from '@infra/yup';

export const AddressSchema = yup.object().shape({
  city: stringRequired({
    english: 'city',
    length: 50,
    portuguese: 'cidade'
  }),
  municipality: stringRequired({
    english: 'municipality',
    length: 50,
    portuguese: 'município'
  }),
  number: numberRequired({
    english: 'number',
    portuguese: 'número'
  }),
  state: stringRequired({
    english: 'state',
    length: 50,
    portuguese: 'estado'
  }),
  street: stringRequired({
    english: 'street',
    length: 255,
    portuguese: 'rua'
  }),
  zipCode: zipCodeRequired()
});

export const insertAddressSchema = yup.object().shape({
  body: AddressSchema
});
