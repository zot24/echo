/**
 * Model Registry + Capability System
 * 
 * This layer allows the orchestrator to assign the right model
 * to each agent based on abstract capabilities.
 */

export type Capability =
  | "reasoning"
  | "coding"
  | "fast"
  | "long-context"
  | "cheap"
  | "creative"
  | "security-review";

export interface ModelDefinition {
  id: string;
  provider: string;
  capabilities: Capability[];
  costPer1kTokens?: { input: number; output: number };
  contextWindow: number;
  notes?: string;
}

export const MODEL_REGISTRY: Record<string, ModelDefinition> = {
  "claude-3.5-sonnet": {
    id: "claude-3.5-sonnet",
    provider: "anthropic",
    capabilities: ["reasoning", "coding", "long-context"],
    contextWindow: 200000,
    notes: "Strong at reasoning and coding",
  },
  "grok-4.3": {
    id: "grok-4.3",
    provider: "xai",
    capabilities: ["reasoning", "coding", "long-context"],
    contextWindow: 128000,
    notes: "Good balance of reasoning and speed",
  },
  "grok-4.1": {
    id: "grok-4.1",
    provider: "xai",
    capabilities: ["fast", "coding"],
    contextWindow: 128000,
  },
  "claude-3-haiku": {
    id: "claude-3-haiku",
    provider: "anthropic",
    capabilities: ["fast", "cheap"],
    contextWindow: 200000,
  },
};

export function getModelsWithCapability(cap: Capability): ModelDefinition[] {
  return Object.values(MODEL_REGISTRY).filter(m =>
    m.capabilities.includes(cap)
  );
}

export function getBestModelForCapabilities(caps: Capability[]): string | null {
  // Simple scoring: more matching capabilities = better
  let best: string | null = null;
  let bestScore = -1;

  for (const [id, model] of Object.entries(MODEL_REGISTRY)) {
    const score = caps.filter(c => model.capabilities.includes(c)).length;
    if (score > bestScore) {
      bestScore = score;
      best = id;
    }
  }

  return best;
}
