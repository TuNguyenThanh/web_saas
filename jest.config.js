/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: "node",
  // Unit + integration tests run under Jest; Playwright E2E specs live in tests/e2e.
  testMatch: [
    "<rootDir>/tests/unit/**/*.test.ts",
    "<rootDir>/tests/integration/**/*.test.ts",
  ],
  transform: {
    "^.+\\.(t|j)sx?$": ["@swc/jest"],
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  clearMocks: true,
};
