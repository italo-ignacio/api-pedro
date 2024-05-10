export type propertyQueryFields =
  | 'name'
  | 'totalArea'
  | 'totalAreaGreaterThan'
  | 'totalAreaLessThan'
  | 'userId';

export const propertyListQueryFields: propertyQueryFields[] = [
  'name',
  'totalAreaGreaterThan',
  'totalAreaLessThan',
  'totalArea',
  'userId'
];
