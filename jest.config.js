/** @type {import("jest").Config} **/
module.exports = {
  testEnvironment: "jsdom",
  coverageReporters: ["json", "json-summary"],
  collectCoverageFrom: ["app/**", "components/**", "utils/**"],
  transform: {
    "^.+\\.(t|j)sx?$": [
      "@swc/jest",
      {
        jsc: {
          transform: {
            react: {
              runtime: "automatic",
            },
          },
        },
      },
    ],
  },
  setupFilesAfterEnv: ["./setup.ts"],
};
