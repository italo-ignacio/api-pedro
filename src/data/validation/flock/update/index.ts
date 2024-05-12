import { numberNotRequired, stringNotRequired } from '@main/utils';
import { yup } from '@infra/yup';

export const updateFlockSchema = yup.object().shape({
  body: yup.object().shape({
    name: stringNotRequired({
      english: 'name',
      length: 255,
      portuguese: 'nome'
    }),
    totalCalves: numberNotRequired({
      english: 'total calves',
      portuguese: 'total de bezerros'
    }),
    totalCows: numberNotRequired({
      english: 'total cows',
      portuguese: 'total de vacas'
    }),
    totalHeifers: numberNotRequired({
      english: 'total heifers',
      portuguese: 'total de novilhas'
    }),
    totalOthers: numberNotRequired({
      english: 'total of other animals',
      portuguese: 'total de outros animais'
    })
  })
});
