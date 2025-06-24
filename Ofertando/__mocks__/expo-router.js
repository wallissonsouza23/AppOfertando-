module.exports = {
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
  }),
  useLocalSearchParams: () => ({}),
};
