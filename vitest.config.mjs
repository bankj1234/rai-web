import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { coverageConfigDefaults, defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    globals: true,
    environment: "jsdom",
    reporters: ["verbose"],
    setupFiles: "./vitest.setup.ts",
    env: {
      COOKIE_SECRET_KEY: "mockedCookieSecretKey_abcdefg",
    },
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov"],
      exclude: [
        ...coverageConfigDefaults.exclude,
        "**/*.config.*",
        "*.config.* ",
        "src/tests/**",
        "src/api/**",
        "src/constants/**",
        "src/stores/**",
      ],
    },
  },
});
