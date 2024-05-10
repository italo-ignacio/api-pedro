export type flockQueryFields =
  | 'name'
  | 'propertyId'
  | 'totalCalves'
  | 'totalCalvesGreaterThan'
  | 'totalCalvesLessThan'
  | 'totalCows'
  | 'totalCowsGreaterThan'
  | 'totalCowsLessThan'
  | 'totalHeifers'
  | 'totalHeifersGreaterThan'
  | 'totalHeifersLessThan'
  | 'totalOthers'
  | 'totalOthersGreaterThan'
  | 'totalOthersLessThan';

export const flockListQueryFields: flockQueryFields[] = [
  'name',
  'propertyId',
  'totalCalves',
  'totalCalvesGreaterThan',
  'totalCalvesLessThan',
  'totalCows',
  'totalCowsGreaterThan',
  'totalCowsLessThan',
  'totalHeifers',
  'totalHeifersGreaterThan',
  'totalHeifersLessThan',
  'totalOthers',
  'totalOthersGreaterThan',
  'totalOthersLessThan'
];
