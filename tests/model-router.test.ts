import { describe, it, expect } from "vitest";
import { selectModelForAgent } from "../models/router";

describe("Model Router", () => {
  it("should return a model for known agents", () => {
    const model = selectModelForAgent("planner");
    expect(model).toBeTruthy();
    expect(typeof model).toBe("string");
  });

  it("should return a model for knowledge-keeper", () => {
    const model = selectModelForAgent("knowledge-keeper");
    expect(model).toBeTruthy();
  });

  it("should return a valid model even for unknown agents", () => {
    const model = selectModelForAgent("non-existent-agent");
    expect(model).toBeTruthy();
    expect(typeof model).toBe("string");
  });
});
