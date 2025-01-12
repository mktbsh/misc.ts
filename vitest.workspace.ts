import { defineWorkspace } from "vitest/config";

export default defineWorkspace([
  {
    extends: "vitest.config.ts",
    test: {
      name: "browser",
      include: ["src/**/*.browser.test.ts"],
      environment: "happy-dom",
    },
  },
  {
    extends: "vitest.config.ts",
    test: {
      name: "node",
      environment: "node",
      include: ["src/**/*.test.ts"],
      exclude: ["src/**/*.browser.test.ts"],
    },
  },
]);
