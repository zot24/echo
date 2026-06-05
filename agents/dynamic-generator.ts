import { Absurd, TaskContext } from "absurd-sdk";

/**
 * Dynamic Generator (Hybrid Template Mode)
 * 
 * Can generate workflows from scratch OR base them on classic templates.
 */
export function registerDynamicGenerator(absurd: Absurd) {
  absurd.registerTask(
    { name: "dynamic-generator" },
    async (params: { 
      task: string; 
      project?: { name: string; path: string };   // NEW: project context
      template?: string;
      constraints?: any 
    }, ctx: TaskContext) => {
      const workflow = await ctx.step("generate", async () => {
        const useTemplate = params.template;

        if (useTemplate) {
          return buildFromTemplate(useTemplate, params.task, params.project, params.constraints);
        }
        return buildFromScratch(params.task, params.project, params.constraints);
      });

      return {
        workflow,
        generatedAt: new Date().toISOString(),
      };
    },
  );
}

function buildFromScratch(task: string, project: any, constraints: any) {
  return {
    kind: "feature-implementation",
    name: task.toLowerCase().replace(/\s+/g, "-").slice(0, 60),
    project: project || null,
    description: task,
    version: 1,
    template: null,
    steps: [
      { id: "scout", agent: "repo-scout", input: { request: task } },
      { id: "analyze", agent: "knowledge-keeper", depends_on: ["scout"] },
      { id: "plan", agent: "planner", depends_on: ["analyze"], model: "claude-3.5-sonnet" },
      { id: "implement", agent: "implementer", depends_on: ["plan"], model: "grok-4.3" },
      { id: "review", agent: "reviewer", depends_on: ["implement"] },
    ],
    control: {
      loop_until: "review.issues.length == 0",
      max_iterations: constraints?.maxIterations || 4,
    },
  };
}

function buildFromTemplate(template: string, task: string, project: any, constraints: any) {
  if (template === "loop-until-done") {
    return {
      kind: "iterative-improvement",
      name: task.toLowerCase().replace(/\s+/g, "-").slice(0, 60),
      project: project || null,
      description: task,
      version: 1,
      template: "loop-until-done",
      steps: [
        { id: "work", agent: "implementer", input: { task } },
        { id: "review", agent: "reviewer", depends_on: ["work"] },
      ],
      control: {
        loop_until: "review.issues.length == 0",
        max_iterations: constraints?.maxIterations || 6,
      },
    };
  }

  // Fallback to default generation
  return buildFromScratch(task, constraints);
}
