import { Absurd } from "absurd-sdk";
import { registerRepoScout } from "./agents/repo-scout";
import { registerKnowledgeKeeper } from "./agents/knowledge-keeper";
import { registerPlanner } from "./agents/planner";
import { registerReviewer } from "./agents/reviewer";
import { registerImplementer } from "./agents/implementer";
import { registerDynamicGenerator } from "./agents/dynamic-generator";
import { registerDynamicExecutor } from "./agents/dynamic-executor";
import { registerTemplateDynamizer } from "./agents/template-dynamizer";
import { registerPlaywrightCapture } from "./agents/playwright-capture";
import { registerWebUiReviewer } from "./agents/web-ui-reviewer";
import { registerTestWorkflow, registerDashboard } from "./workflows/test-swarm";
import { registerLoopUntilDone } from "./workflows/loop-until-done";
import { registerFanoutAndSynthesize } from "./workflows/fanout-and-synthesize";
import { registerGenerateAndFilter } from "./workflows/generate-and-filter";
import { registerTournament } from "./workflows/tournament";
import { registerAuthImprovementWorkflow } from "./workflows/auth-improvement";

/**
 * Swarm System - Main Registration Point
 * 
 * This file registers all agents with Absurd.
 * It should be imported/called when initializing the swarm system.
 */
export function registerSwarmAgents(absurd: Absurd) {
  registerRepoScout(absurd);
  registerKnowledgeKeeper(absurd);
  registerPlanner(absurd);
  registerReviewer(absurd);
  registerImplementer(absurd);
  registerDynamicGenerator(absurd);
  registerDynamicExecutor(absurd);
  registerTemplateDynamizer(absurd);
  registerPlaywrightCapture(absurd);
  registerWebUiReviewer(absurd);
  registerTestWorkflow(absurd);
  registerDashboard(absurd);
  registerLoopUntilDone(absurd);
  registerFanoutAndSynthesize(absurd);
  registerGenerateAndFilter(absurd);
  registerTournament(absurd);
  registerAuthImprovementWorkflow(absurd);

  console.log("[echo] Registered: repo-scout, knowledge-keeper, planner, reviewer, implementer, dynamic-generator, dynamic-executor, template-dynamizer, playwright-capture, web-ui-reviewer, loop-until-done, fanout-and-synthesize, generate-and-filter, tournament, auth-improvement");
}
