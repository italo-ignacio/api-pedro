interface GetPageAndLimitInput {
  query: {
    page?: number;
    limit?: number;
  };
}

interface GetPageAndLimitOutput {
  skip: number;
  take: number;
}

export const getPagination = ({ query }: GetPageAndLimitInput): GetPageAndLimitOutput => {
  const page = Number(query.page ?? 1);
  const limit = Number(query.limit ?? 30);

  const skip = (page - 1) * limit;
  const take = limit;

  return { skip, take };
};
