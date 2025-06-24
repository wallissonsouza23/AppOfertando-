module.exports = {
  preset: 'jest-expo',
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect', '<rootDir>/jest-setup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?react-native|@react-native|@react-navigation|expo|moti|@expo/vector-icons|expo-router|@react-native-async-storage/async-storage)'
  ],
  testMatch: ['**/__tests__/**/*.test.ts?(x)'],
  testPathIgnorePatterns: ['/node_modules/', '/build/'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  globals: {
    'ts-jest': {
      babelConfig: true,
    },
  },
  moduleNameMapper: {
    '^@react-native-async-storage/async-storage$': '<rootDir>/__mocks__/@react-native-async-storage/async-storage.js',
  },
};
