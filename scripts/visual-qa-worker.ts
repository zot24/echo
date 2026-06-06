/**
 * Dedicated Visual QA Worker
 * 
 * Registers only the agents needed for Visual QA and starts processing tasks.
 * 
 * Usage:
 *   npx tsx scripts/visual-qa-worker.ts
 */
import { Absurd } from "absurd-sdk";
import { registerPlaywrightCapture } from "../agents/playwright-capture";
import { registerWebUiReviewer } from "../agents/web-ui-reviewer";
import { registerTemplateDynamizer } from "../agents/template-dynamizer";

async function main() {
  console.log("[visual-qa-worker] Starting dedicated Visual QA worker...");

  const absurd = new Absurd({
    db: "postgresql://localhost/absurd2",
  });

  // Register only Visual QA related agents
  registerPlaywrightCapture(absurd);
  registerWebUiReviewer(absurd);
  registerTemplateDynamizer(absurd);

  console.log("[visual-qa-worker] Agents registered. Waiting for tasks...");

  // Keep the process alive
  await new Promise(() => {});
}

main().catch(console.error);
