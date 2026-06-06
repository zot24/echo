import { Absurd } from "absurd-sdk";

/**
 * Safe spawn helper
 * 
 * Always requires a queue when using awaitTaskResult later
 * to prevent Absurd deadlock errors.
 */
export async function safeSpawn(
  absurd: Absurd,
  taskName: string,
  input: any,
  options: { queue: string }
) {
  if (!options.queue) {
    throw new Error("safeSpawn requires a 'queue' option to avoid deadlock with awaitTaskResult");
  }

  return absurd.spawn(taskName, input, { queue: options.queue });
}
