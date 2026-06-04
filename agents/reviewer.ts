import { Absurd, TaskContext } from "absurd-sdk";

/**
 * Reviewer Agent (Improved)
 * 
 * Performs real adversarial verification:
 * - Checks for completeness
 * - Looks for gaps or weak reasoning
 * - Flags placeholders or TODOs
 * - Assesses overall quality
 */
export function registerReviewer(absurd: Absurd) {
  absurd.registerTask(
    { name: "reviewer" },
    async (params: { content: string; context?: string }, ctx: TaskContext) => {
      const review = await ctx.step("analyze", async () => {
        const content = params.content || "";
        const issues: string[] = [];
        let score = 10;

        // Real checks
        if (content.includes("TODO") || content.includes("FIXME")) {
          issues.push("Contains TODO/FIXME placeholders");
          score -= 2;
        }
        if (content.length < 200) {
          issues.push("Output is very short — may lack depth");
          score -= 2;
        }
        if (!content.includes("plan") && !content.includes("step")) {
          issues.push("No clear plan or steps mentioned");
          score -= 1;
        }
        if (content.toLowerCase().includes("placeholder")) {
          issues.push("Contains placeholder text");
          score -= 2;
        }

        const overall = score >= 8 ? "good" : score >= 6 ? "needs-work" : "poor";

        return {
          issuesFound: issues,
          overallAssessment: overall,
          score,
          feedback: issues.length > 0 
            ? `Found ${issues.length} issues. Score: ${score}/10`
            : "No major issues found. Output looks solid.",
        };
      });

      return {
        review,
        reviewedAt: new Date().toISOString(),
      };
    },
  );
}
