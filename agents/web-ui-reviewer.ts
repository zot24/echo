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

      // Placeholder analysis (in real version this would be vision-based)
      for (const [url, path] of Object.entries(params.screenshots)) {
        issues.push(`[MVP] Screenshot captured for ${url} at ${path}`);
        issues.push("→ Consider checking spacing, typography, and responsiveness");
      }

      return {
        issues,
        reviewedAt: new Date().toISOString(),
        note: "This is a placeholder. Real vision analysis coming soon.",
      };
    },
  );
}
