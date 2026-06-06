/**
 * Quick & Dirty Visual QA Runner
 * 
 * Manually chains playwright-capture → web-ui-reviewer
 * 
 * Usage:
 *   npx tsx scripts/manual-visual-qa.ts http://localhost:3000
 */
import { Absurd } from "absurd-sdk";

const URL = process.argv[2] || "http://localhost:3000";

async function main() {
  console.log(`[manual-qa] Starting Visual QA on: ${URL}`);

  const absurd = new Absurd({
    db: "postgresql://localhost/absurd2",
  });

  // Step 1: Capture screenshots
  console.log("[manual-qa] Capturing screenshots...");
  const capture = await absurd.spawn("playwright-capture", {
    urls: [URL],
  }, { queue: "agents" });

  const captureResult = await absurd.awaitTaskResult(capture.taskID, { timeout: 120000 });
  console.log("[manual-qa] Capture done.");

  // Step 2: Run reviewer
  console.log("[manual-qa] Running web-ui-reviewer...");
  const review = await absurd.spawn("web-ui-reviewer", {
    screenshots: captureResult.result?.screenshots || {},
  }, { queue: "agents" });

  const reviewResult = await absurd.awaitTaskResult(review.taskID, { timeout: 60000 });
  console.log("[manual-qa] Review result:", reviewResult);

  console.log("[manual-qa] Done.");
}

main().catch(console.error);
