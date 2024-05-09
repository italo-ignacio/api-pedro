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
  const subtractPage = 1;

  const skip = (page - subtractPage) * limit;
  const take = limit;

  return { skip, take };
};
