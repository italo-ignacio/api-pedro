/* eslint-disable @typescript-eslint/strict-boolean-expressions */
interface GetPageAndLimitInput<QueryType extends string, ModelType extends string> {
  query: {
    [key in QueryType]?: string;
  } & {
    orderBy?: QueryType;
    sort?: 'asc' | 'desc';
    distinct?: ModelType;
  };
  list: QueryType[];
}

interface GetPageAndLimitOutput {
  orderBy: object;
  where: object;
}

const isObjectEmpty = (obj: object): boolean => Object.keys(obj).length === 0;

const getDate = (item: string | undefined, isEnd?: boolean): Date | string | null => {
  if (!item) return null;

  const date = new Date(item?.slice(0, 10));

  if (isNaN(date.getTime())) return null;

  if (isEnd ?? false) return date.toISOString().replace('T00:00:00.000Z', 'T23:59:59.999Z');

  return date;
};

const hasOrder = (query: { orderBy?: string; sort?: 'asc' | 'desc' }): boolean =>
  typeof query.orderBy !== 'undefined' &&
  typeof query.sort !== 'undefined' &&
  (query.sort === 'asc' || query.sort === 'desc');

export const getGenericFilter = <QueryType extends string, ModelType extends string>({
  query,
  list
}: GetPageAndLimitInput<QueryType, ModelType>): GetPageAndLimitOutput => {
  const orderBy = {};
  const where: object[] = [];

  let hasSetDate = false;

  for (const item of list) {
    if (hasOrder(query))
      if (item === 'startDate' && query.orderBy === 'createdAt')
        Object.assign(orderBy, {
          [query.orderBy]: query.sort
        });
      else if (item === query.orderBy)
        Object.assign(orderBy, {
          [query.orderBy]: query.sort
        });

    if (typeof query[item] !== 'undefined')
      if (item === 'startDate' || item === 'endDate') {
        if (!hasSetDate) {
          hasSetDate = true;
          const { startDate: startDateQuery, endDate: endDateQuery } = query as {
            startDate: string | undefined;
            endDate: string | undefined;
          };

          const startDate = getDate(startDateQuery);
          const endDate = getDate(endDateQuery, true);

          const dateList: unknown[] = [];

          if (startDate !== null)
            dateList.push({
              createdAt: {
                gte: startDate
              }
            });

          if (endDate !== null)
            dateList.push({
              createdAt: {
                lte: endDate
              }
            });

          if (dateList.length > 0) where.push({ AND: dateList });
        }
      } else if (item.endsWith('Enum'))
        where.push({
          [item.replace('Enum', '')]: {
            equals: query[item]
          }
        });
      else if (item.endsWith('Id'))
        where.push({
          [item]: {
            equals: query[item] === 'null' ? null : Number(query[item])
          }
        });
      else
        where.push({
          [item]: {
            contains: query[item],
            mode: 'insensitive'
          }
        });
  }

  if (isObjectEmpty(orderBy)) Object.assign(orderBy, { id: 'desc' });

  return {
    orderBy,
    where:
      where.length > 0
        ? {
            OR: where
          }
        : {}
  };
};
