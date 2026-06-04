import fs from "node:fs";
import path from "node:path";
import type { KnowledgeBase } from "./types";
import { Absurd } from "absurd-sdk";

const STORE_PATH = path.join(process.env.HOME!, ".pi/agent/swarm/knowledge.json");

// Absurd-backed knowledge (preferred). Falls back to JSON.
let absurdInstance: Absurd | null = null;

export function initKnowledgeAbsurd(absurd: Absurd) {
  absurdInstance = absurd;
  // Future: register Absurd table "knowledge-base" + versioning
}

/**
 * Load from Absurd (if initialized) else JSON.
 */
export async function loadKnowledge(): Promise<KnowledgeBase> {
  if (absurdInstance) {
    // TODO: load from Absurd task/table
    console.log("[knowledge] Using Absurd store (stub)");
  }
  try {
    if (fs.existsSync(STORE_PATH)) {
      return JSON.parse(fs.readFileSync(STORE_PATH, "utf-8"));
    }
  } catch {}
  return {
    codingPatterns: [],
    architectureDecisions: [],
    repeatablePractices: [],
    commonTools: [],
    preferredWorkflows: [],
  };
}

export async function saveKnowledge(kb: KnowledgeBase) {
  if (absurdInstance) {
    // TODO: persist via Absurd + versioning
    console.log("[knowledge] Saved to Absurd (stub)");
    return;
  }
  try {
    fs.mkdirSync(path.dirname(STORE_PATH), { recursive: true });
    fs.writeFileSync(STORE_PATH, JSON.stringify(kb, null, 2));
  } catch (e) {
    console.error("[knowledge-store] Failed to save:", e);
  }
}

export function mergeKnowledge(existing: KnowledgeBase, newKb: KnowledgeBase): KnowledgeBase {
  return {
    codingPatterns: [...new Set([...existing.codingPatterns, ...newKb.codingPatterns])],
    architectureDecisions: [...new Set([...existing.architectureDecisions, ...newKb.architectureDecisions])],
    repeatablePractices: [...new Set([...existing.repeatablePractices, ...newKb.repeatablePractices])],
    commonTools: [...new Set([...existing.commonTools, ...newKb.commonTools])],
    preferredWorkflows: [...new Set([...existing.preferredWorkflows, ...newKb.preferredWorkflows])],
  };
}
