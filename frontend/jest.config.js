const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

/** @type {import('jest').Config} */
const customJestConfig = {
  setupFiles: ['<rootDir>/jest.polyfills.js'], 
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^react-resizable-panels$': '<rootDir>/__mocks__/react-resizable-panels.js', 
  },
}

module.exports = createJestConfig(customJestConfig)