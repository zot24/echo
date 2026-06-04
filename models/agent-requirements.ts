import type { Capability } from "./registry";

/**
 * Agent Requirements
 * 
 * Each agent can declare what capabilities it needs.
 * The orchestrator uses this to pick the right model.
 */
export interface AgentRequirements {
  requiredCapabilities: Capability[];
  preferredModel?: string;        // explicit override
  fallbackModels?: string[];
}

/**
 * Default requirements per agent type
 */
export const DEFAULT_AGENT_REQUIREMENTS: Record<string, AgentRequirements> = {
  "repo-scout": {
    requiredCapabilities: ["fast", "coding"],
  },
  "knowledge-keeper": {
    requiredCapabilities: ["reasoning", "long-context"],
  },
  "planner": {
    requiredCapabilities: ["reasoning", "long-context"],
  },
  "reviewer": {
    requiredCapabilities: ["reasoning", "coding", "security-review"],
  },
  "implementer": {
    requiredCapabilities: ["coding"],
  },
};
