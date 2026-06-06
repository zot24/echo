import { describe, it, expect, vi } from "vitest";
import { safeSpawn } from "../tools/safe-spawn";

describe("safeSpawn", () => {
  it("throws if queue is not provided", async () => {
    const mockAbsurd = {} as any;

    await expect(
      safeSpawn(mockAbsurd, "some-task", {}, { queue: "" })
    ).rejects.toThrow("requires a 'queue' option");
  });

  it("calls spawn with correct queue when provided", async () => {
    const spawnMock = vi.fn().mockResolvedValue({ taskID: "123" });
    const mockAbsurd = { spawn: spawnMock } as any;

    await safeSpawn(mockAbsurd, "repo-scout", { foo: "bar" }, { queue: "agents" });

    expect(spawnMock).toHaveBeenCalledWith(
      "repo-scout",
      { foo: "bar" },
      { queue: "agents" }
    );
  });
});
