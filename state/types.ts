/**
 * Shared state types for the Agent Swarm system.
 * These types are used across all agents and workflows.
 */

export interface ProjectInfo {
  name: string;
  path: string;
  languages: string[];
  frameworks: string[];
  authPatterns: string[];
  lastScanned: string; // ISO date
}

export interface KnowledgeBase {
  codingPatterns: string[];
  architectureDecisions: string[];
  repeatablePractices: string[];
  commonTools: string[];
  preferredWorkflows: string[];
}

export interface SwarmState {
  requestId: string;
  originalRequest: string;
  projects: ProjectInfo[];
  knowledge: KnowledgeBase;
  currentPhase: "scouting" | "analysis" | "planning" | "implementation" | "done";
  createdAt: string;
  updatedAt: string;
}
