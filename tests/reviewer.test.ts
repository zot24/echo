import { describe, it, expect } from "vitest";

// Simple unit test for reviewer logic (extracted from the agent)
function analyzeContent(content: string) {
  const issues: string[] = [];
  let score = 10;

  if (content.includes("TODO") || content.includes("FIXME")) {
    issues.push("Contains TODO/FIXME placeholders");
    score -= 2;
  }
  if (content.length < 200) {
    issues.push("Output is very short");
    score -= 2;
  }
  if (!content.includes("plan") && !content.includes("step")) {
    issues.push("No clear plan or steps mentioned");
    score -= 1;
  }

  return { issues, score };
}

describe("Reviewer Logic", () => {
  it("should flag TODOs", () => {
    const result = analyzeContent("This is a plan. TODO: fix auth");
    expect(result.issues.length).toBeGreaterThan(0);
  });

  it("should penalize very short output", () => {
    const result = analyzeContent("short");
    expect(result.score).toBeLessThan(10);
  });

  it("should give reasonable score to good content", () => {
    const good = "This is a detailed plan with multiple steps and no placeholders.";
    const result = analyzeContent(good);
    expect(result.score).toBeGreaterThanOrEqual(8);
  });
});
