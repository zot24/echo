import { Absurd, TaskContext } from "absurd-sdk";
import { chromium } from "playwright";

/**
 * Playwright Capture Agent
 * 
 * Takes screenshots of given URLs.
 * Used as the first step in Visual QA workflows.
 */
export function registerPlaywrightCapture(absurd: Absurd) {
  absurd.registerTask(
    { name: "playwright-capture" },
    async (params: { urls: string[] }, ctx: TaskContext) => {
      const browser = await chromium.launch();
      const page = await browser.newPage();

      const screenshots: Record<string, string> = {};

      for (const url of params.urls || []) {
        await page.goto(url, { waitUntil: "networkidle" });
        const screenshotPath = `/tmp/screenshot-${Date.now()}.png`;
        await page.screenshot({ path: screenshotPath, fullPage: true });
        screenshots[url] = screenshotPath;
      }

      await browser.close();

      return {
        screenshots,
        capturedAt: new Date().toISOString(),
      };
    },
  );
}
