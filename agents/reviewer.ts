import { Absurd, TaskContext } from "absurd-sdk";

/**
 * Reviewer Agent — Adversarial Verification
 * 
 * Takes output from another agent and challenges it.
 * Looks for issues, gaps, weak assumptions, or improvements.
 */
export function registerReviewer(absurd: Absurd) {
  absurd.registerTask(
    { name: "reviewer" },
    async (params: { originalOutput: any; context?: string }, ctx: TaskContext) => {
      const review = await ctx.step("review", async () => {
        const output = JSON.stringify(params.originalOutput || {});
        const issuesFound: string[] = [];
        const suggestions: string[] = [];

        if (output.length < 50) issuesFound.push("Output too brief");
        if (!output.includes("plan") && params.context?.includes("plan")) {
          issuesFound.push("Missing plan details");
          suggestions.push("Include explicit implementation steps");
        }
        if (output.includes("TODO") || output.includes("placeholder")) {
          issuesFound.push("Contains unresolved placeholders");
        }

        const overallAssessment = issuesFound.length === 0 ? "Solid" : "Needs work";
        const feedback = issuesFound.length > 0 
          ? `Found ${issuesFound.length} issues. Address: ${issuesFound.join(", ")}` 
          : "Output looks complete and actionable.";

        return { issuesFound, suggestions, overallAssessment, feedback };
      });

      return {
        review,
        reviewedAt: new Date().toISOString(),
      };
    },
  );
}
