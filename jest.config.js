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
  // Tests that hit the DB share one seeded SQLite file; run serially to avoid
  // SQLite write contention.
  setupFiles: ["<rootDir>/tests/jest.env.ts"],
  globalSetup: "<rootDir>/tests/jest.globalSetup.ts",
  maxWorkers: 1,
};
