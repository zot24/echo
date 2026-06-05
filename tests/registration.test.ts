import { describe, it, expect } from "vitest";
import { Absurd } from "absurd-sdk";
import { registerSwarmAgents } from "../index";

describe("Echo Swarm - Task Registration", () => {
  it("should register all tasks without throwing", () => {
    const absurd = new Absurd({ db: "postgresql://localhost/absurd2" });

    expect(() => {
      registerSwarmAgents(absurd);
    }).not.toThrow();
  });

  it("should not have duplicate task names", () => {
    const absurd = new Absurd({ db: "postgresql://localhost/absurd2" });
    registerSwarmAgents(absurd);

    // @ts-ignore - accessing internal registry for test
    const registeredTasks = Object.keys(absurd["tasks"] || {});

    const uniqueTasks = new Set(registeredTasks);
    expect(uniqueTasks.size).toBe(registeredTasks.length);
  });
});
