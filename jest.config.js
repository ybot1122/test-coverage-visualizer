const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
  testEnvironment: "jsdom",
  coverageReporters: ["json", "json-summary"],
  transform: {
    ...tsJestTransformCfg,
  },
  setupFilesAfterEnv: ["./setup.ts"],
};
