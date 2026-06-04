/**
 * Real-life E2E example runner
 * 
 * Run with: npx tsx examples/run-auth-improvement.ts
 * (or ts-node / bun)
 *
 * Requires: absurd-sdk installed in the environment
 */

import { Absurd } from "absurd-sdk";
import { registerSwarmAgents } from "../index";

async function main() {
  console.log("[swarm] Starting real-life auth improvement example...");

  const absurd = new Absurd({
    // Add your Absurd/Postgres config here if needed
    // db: { connectionString: process.env.ABSURD_DB }
  });

  registerSwarmAgents(absurd);

  // Spawn the full end-to-end workflow
  const task = await absurd.spawn("improve-auth-across-projects", {
    request: "Improve authentication security and patterns across all projects",
  });

  console.log(`[swarm] Task spawned: ${task.taskID}`);
  console.log("[swarm] Waiting for completion (this may take time with a worker)...");

  // In a real setup you would run a worker separately:
  //   npx absurd-worker or /swarm worker
  // For demo we just show the spawn.

  console.log("\nNext steps:");
  console.log("1. Start a worker: /swarm worker   (or absurd worker)");
  console.log("2. Watch progress in Habitat: habitat run -db-name absurd2");
  console.log("3. Check status: /swarm status", task.taskID);

  // If you have a running Absurd instance you can await:
  // const result = await absurd.waitForTask(task.taskID, { timeout: 300000 });
  // console.log("Result:", result);
}

main().catch(console.error);