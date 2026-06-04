import {
  MODEL_REGISTRY,
  getBestModelForCapabilities,
  type Capability,
} from "./registry";
import {
  DEFAULT_AGENT_REQUIREMENTS,
  type AgentRequirements,
} from "./agent-requirements";

/**
 * Model Router
 * 
 * Given an agent name (or requirements), returns the best model to use.
 */
export function selectModelForAgent(
  agentName: string,
  overrideRequirements?: Partial<AgentRequirements>
): string {
  const defaults = DEFAULT_AGENT_REQUIREMENTS[agentName] || {
    requiredCapabilities: [],
  };

  const requirements: AgentRequirements = {
    ...defaults,
    ...overrideRequirements,
  };

  // If a preferred model is explicitly set, use it
  if (requirements.preferredModel && MODEL_REGISTRY[requirements.preferredModel]) {
    return requirements.preferredModel;
  }

  // Otherwise, pick the best model based on required capabilities
  const best = getBestModelForCapabilities(requirements.requiredCapabilities);
  if (best) return best;

  // Fallback
  return "grok-4.3";
}
