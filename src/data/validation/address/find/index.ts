export type addressQueryFields =
  | 'city'
  | 'municipality'
  | 'number'
  | 'state'
  | 'street'
  | 'zipCode';

export const addressListQueryFields: addressQueryFields[] = [
  'city',
  'municipality',
  'number',
  'state',
  'street',
  'zipCode'
];
