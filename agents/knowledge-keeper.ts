import { Absurd, TaskContext } from "absurd-sdk";
import type { ProjectInfo, KnowledgeBase } from "../state/types";
import { loadKnowledge, saveKnowledge, mergeKnowledge } from "../state/knowledge-store";
import { selectModelForAgent } from "../models/router";

/**
 * Knowledge Keeper — Core long-term value of the swarm
 * 
 * Extracts how the user codes, architects, and manages software
 * so that patterns can be reused and improved over time.
 */
export function registerKnowledgeKeeper(absurd: Absurd) {
  const model = selectModelForAgent("knowledge-keeper");

  absurd.registerTask(
    { name: "knowledge-keeper" },
    async (params: { projects: ProjectInfo[] }, ctx: TaskContext) => {
      const analysis = await ctx.step("analyze", async () => {
        const langCount: Record<string, number> = {};
        const fwCount: Record<string, number> = {};
        const authSet = new Set<string>();

        params.projects.forEach(p => {
          p.languages.forEach(l => langCount[l] = (langCount[l] || 0) + 1);
          p.frameworks.forEach(f => fwCount[f] = (fwCount[f] || 0) + 1);
          p.authPatterns.forEach(a => authSet.add(a));
        });

        return {
          topLanguages: Object.entries(langCount).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([l]) => l),
          topFrameworks: Object.entries(fwCount).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([f]) => f),
          authPatterns: Array.from(authSet),
          totalProjects: params.projects.length,
        };
      });

      const knowledge: KnowledgeBase = await ctx.step("extract-insights", async () => {
        const codingPatterns: string[] = [];
        const architectureDecisions: string[] = [];
        const repeatablePractices: string[] = [];

        if (analysis.topLanguages.includes("TypeScript")) {
          codingPatterns.push("Strong preference for TypeScript");
        }
        if (analysis.topLanguages.includes("Rust")) {
          codingPatterns.push("Uses Rust for performance-sensitive components");
        }
        if (analysis.topFrameworks.length > 0) {
          architectureDecisions.push(`Frequently uses: ${analysis.topFrameworks.join(", ")}`);
        }
        if (analysis.authPatterns.length > 0) {
          repeatablePractices.push("Authentication implemented early in projects");
        }

        return {
          codingPatterns,
          architectureDecisions,
          repeatablePractices,
          commonTools: ["Mercator", "pi", "git", "Docker"],
          preferredWorkflows: ["Scout → Knowledge → Plan → Implement"],
        };
      });

      // Merge with existing knowledge and persist
      const existing = await loadKnowledge();
      const merged = mergeKnowledge(existing, knowledge);
      await saveKnowledge(merged);

      return {
        knowledge: merged,
        analysis,
        modelUsed: model,
        analyzedAt: new Date().toISOString(),
      };
    },
  );
}
