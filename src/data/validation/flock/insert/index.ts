import { numberNotRequired, numberRequired, stringRequired } from '@main/utils';
import { yup } from '@infra/yup';

export const flockSchema = yup.object().shape({
  name: stringRequired({
    english: 'name',
    length: 255,
    portuguese: 'nome'
  }),
  propertyId: numberRequired({
    english: 'property id',
    portuguese: 'id da propriedade'
  }),
  totalCalves: numberRequired({
    english: 'total calves',
    portuguese: 'total de bezerros'
  }),
  totalCows: numberRequired({
    english: 'total cows',
    portuguese: 'total de vacas'
  }),
  totalHeifers: numberRequired({
    english: 'total heifers',
    portuguese: 'total de novilhas'
  }),
  totalOthers: numberRequired({
    english: 'total of other animals',
    portuguese: 'total de outros animais'
  }),
  userId: numberNotRequired({
    english: 'user id',
    portuguese: 'id do usuário'
  })
});

export const insertFlockSchema = yup.object().shape({
  body: flockSchema
});
