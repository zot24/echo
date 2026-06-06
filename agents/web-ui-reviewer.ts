import { Absurd, TaskContext } from "absurd-sdk";

/**
 * Web UI Reviewer Agent (MVP)
 * 
 * Analyzes screenshots and flags common UX/UI issues.
 * In a real version this would use vision models or image analysis.
 */
export function registerWebUiReviewer(absurd: Absurd) {
  absurd.registerTask(
    { name: "web-ui-reviewer" },
    async (params: { screenshots: Record<string, string> }, ctx: TaskContext) => {
      const issues: string[] = [];
      const recommendations: string[] = [];

      for (const [url, path] of Object.entries(params.screenshots)) {
        issues.push(`Screenshot captured: ${url}`);
        issues.push(`  - Path: ${path}`);

        recommendations.push("Check spacing consistency (margins, padding)");
        recommendations.push("Review typography hierarchy");
        recommendations.push("Verify responsive behavior");
        recommendations.push("Ensure sufficient color contrast");
      }

      return {
        issues,
        recommendations,
        reviewedAt: new Date().toISOString(),
        note: "MVP version. Vision model analysis coming soon.",
      };
    },
  );
}
