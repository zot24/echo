import fs from "node:fs";
import yaml from "js-yaml";

/**
 * YAML Workflow Loader (Early Version)
 * 
 * Allows defining workflows declaratively.
 * 
 * Example:
 * 
 * name: improve-auth
 * steps:
 *   - scout
 *   - knowledge-keeper
 *   - planner:
 *       model: claude-3.5-sonnet
 *   - implementer:
 *       model: grok-4.3
 *       executor: pi-subagent
 */

export interface YamlWorkflow {
  name: string;
  description?: string;
  steps: Array<string | Record<string, any>>;
}

export function loadWorkflowFromYaml(filePath: string): YamlWorkflow {
  const content = fs.readFileSync(filePath, "utf-8");
  return yaml.load(content) as YamlWorkflow;
}
