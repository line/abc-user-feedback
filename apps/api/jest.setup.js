jest.mock('typeorm-transactional', () => ({
  Transactional: () => () => ({}),
  initializeTransactionalContext: () => {},
  addTransactionalDataSource: (res) => res,
}));
jest.mock('nestjs-typeorm-paginate', () => ({
  paginate: (_, option) => {
    return {
      meta: {
        itemCount: 1,
        totalItems: (option.page - 1) * option.limit + 1,
        pageCount: option.page,
        currentPage: option.page,
      },
      items: [],
    };
  },
}));
