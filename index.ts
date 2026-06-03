import { Absurd } from "absurd-sdk";
import { registerRepoScout } from "./agents/repo-scout";
import { registerKnowledgeKeeper } from "./agents/knowledge-keeper";
import { registerPlanner } from "./agents/planner";
import { registerTestWorkflow } from "./workflows/test-swarm";

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
  registerTestWorkflow(absurd);

  console.log("[swarm] Registered: repo-scout, knowledge-keeper, planner, test-swarm workflow");
}
