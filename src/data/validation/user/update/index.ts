import { stringNotRequired } from '@main/utils';
import { yup } from '@infra/yup';

export const updateUserSchema = yup.object().shape({
  body: yup.object().shape({
    email: stringNotRequired({
      english: 'email',
      length: 255,
      portuguese: 'e-mail'
    }),
    name: stringNotRequired({
      english: 'name',
      length: 255,
      portuguese: 'nome'
    }),
    password: stringNotRequired()
  })
});
