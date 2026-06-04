import { Absurd, TaskContext } from "absurd-sdk";

/**
 * End-to-End Workflow: Improve Authentication Across Projects
 * 
 * This workflow demonstrates a realistic multi-agent flow:
 * 
 * 1. Repo Scout     → Discover all projects
 * 2. Knowledge Keeper → Extract patterns and knowledge
 * 3. Planner          → Create implementation plan
 * 4. Implementer      → Execute work (via pi-subagent)
 */
export function registerAuthImprovementWorkflow(absurd: Absurd) {
  absurd.registerTask(
    { name: "improve-auth-across-projects" },
    async (params: { request: string }, ctx: TaskContext) => {
      // Step 1: Scout all projects
      const scoutTask = await ctx.step("spawn-scout", async () => {
        return await absurd.spawn("repo-scout", { requestId: Date.now().toString() }, { queue: "agents" });
      });
      const scoutResult = await ctx.awaitTaskResult(scoutTask.taskID, { timeout: 120 });
      const projects = scoutResult.state === "completed" ? scoutResult.result?.projects || [] : [];

      // Step 2: Run Knowledge Keeper
      const keeperTask = await ctx.step("spawn-keeper", async () => {
        return await absurd.spawn("knowledge-keeper", { projects }, { queue: "agents" });
      });
      const keeperResult = await ctx.awaitTaskResult(keeperTask.taskID, { timeout: 60 });
      const knowledge = keeperResult.state === "completed" ? keeperResult.result?.knowledge : null;

      // Step 3: Create Plan
      const plannerTask = await ctx.step("spawn-planner", async () => {
        return await absurd.spawn("planner", { projects }, { queue: "agents" });
      });
      const plannerResult = await ctx.awaitTaskResult(plannerTask.taskID, { timeout: 60 });

      // Step 4: Implement (via Implementer → pi-subagent)
      const implementerTask = await ctx.step("spawn-implementer", async () => {
        return await absurd.spawn("implementer", {
          task: "Improve authentication across discovered projects",
          plan: plannerResult.state === "completed" ? plannerResult.result : null,
        }, { queue: "agents" });
      });
      const implementerResult = await ctx.awaitTaskResult(implementerTask.taskID, { timeout: 120 });

      return {
        request: params.request,
        projectsAnalyzed: projects.length,
        knowledgeExtracted: !!knowledge,
        planCreated: plannerResult.state === "completed",
        implementationStatus: implementerResult.state === "completed" ? "delegated" : "failed",
        completedAt: new Date().toISOString(),
      };
    },
  );
}
