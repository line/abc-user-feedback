jest.mock('typeorm-transactional', () => ({
  Transactional: () => () => ({}),
  initializeTransactionalContext: () => {},
  addTransactionalDataSource: (res) => res,
}));
