import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  timeout: 30_000,
  use: {
    baseURL: "http://localhost:3100",
    headless: true,
    permissions: ["clipboard-read", "clipboard-write"],
  },
  webServer: {
    command: "npm run dev -- --port 3100",
    port: 3100,
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
