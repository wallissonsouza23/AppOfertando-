export const goBackMock = jest.fn();

export const useNavigation = () => ({
  goBack: goBackMock,
});
