import type { PlaywrightTestConfig } from "@playwright/test";
import { devices } from "@playwright/test";

const config: PlaywrightTestConfig = {
  testDir: "./tests/e2e",
  timeout: 30 * 1000,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : 4,
  // webServer: {
  //   command: "npm run dev",
  //   port: 3000,
  //   timeout: 120 * 1000,
  //   reuseExistingServer: false,
  //   ignoreHTTPSErrors: true,
  // },

  use: {
    trace: "on-first-retry",
  },

  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
      },
    },
    {
      name: "firefox",
      use: {
        ...devices["Desktop Firefox"],
      },
    },
  ],
};

export default config;
