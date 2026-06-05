/**
 * Echo Dashboard Generator (Improved)
 * 
 * Shows multiple concurrent projects + basic live activity log.
 */
import { Client } from "pg";
import fs from "node:fs";
import path from "node:path";

const DB_URL = "postgresql://localhost/absurd2";
const OUTPUT_PATH = path.join(process.env.HOME!, ".pi/agent/swarm/dashboard/echo-dashboard.html");

async function main() {
  const client = new Client({ connectionString: DB_URL });
  await client.connect();

  const res = await client.query(`
    SELECT task_id, queue, state, created_at, result
    FROM absurd.t_default
    ORDER BY created_at DESC
    LIMIT 30
  `);

  await client.end();

  const workflows = res.rows.map(row => ({
    id: row.task_id,
    name: row.queue || "default",
    status: row.state,
    created: row.created_at,
    kind: row.result?.kind || "unknown",
    iterations: row.result?.iterations || 1,
    models: extractModels(row.result),
  }));

  const html = generateHTML(workflows);
  fs.writeFileSync(OUTPUT_PATH, html);
  console.log("Dashboard generated:", OUTPUT_PATH);
}

function extractModels(result: any): string[] {
  if (!result?.results) return [];
  return Object.values(result.results)
    .map((r: any) => r.model)
    .filter(Boolean) as string[];
}

function generateHTML(workflows: any[]): string {
  const cards = workflows.map(w => `
    <div class="workflow">
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <h3 style="margin:0;">${w.name}</h3>
        <span class="status ${w.status}">${w.status}</span>
      </div>
      <div class="kind">${w.kind} • ${w.iterations} iteration(s)</div>
      <div class="meta">Created: ${new Date(w.created).toLocaleString()}</div>
      <div class="models">Models: ${w.models.join(", ") || "—"}</div>

      <details style="margin-top:12px;">
        <summary style="cursor:pointer; color:#555;">View Activity Log</summary>
        <div style="font-family:monospace; font-size:0.85rem; background:#f8f9fa; padding:10px; margin-top:8px; border-radius:4px;">
          [${new Date(w.created).toLocaleTimeString()}] Workflow started<br>
          [${new Date(w.created).toLocaleTimeString()}] Running ${w.iterations} iteration(s)<br>
          [${new Date().toLocaleTimeString()}] Current status: ${w.status}
        </div>
      </details>
    </div>
  `).join("\n");

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Echo Dashboard</title>
  <style>
    body { font-family: system-ui, sans-serif; margin: 40px; background: #f8f9fa; color: #222; }
    h1 { margin-bottom: 8px; }
    .workflow { background: white; border: 1px solid #ddd; border-radius: 10px; padding: 20px; margin-bottom: 18px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
    .kind { font-size: 0.9rem; color: #555; margin: 6px 0; }
    .meta { font-size: 0.85rem; color: #666; }
    .models { font-size: 0.85rem; color: #444; margin-top: 6px; }
    .status { padding: 3px 10px; border-radius: 9999px; font-size: 0.75rem; font-weight: 500; }
    .completed { background: #d4edda; color: #155724; }
    .running { background: #fff3cd; color: #856404; }
    .failed { background: #f8d7da; color: #721c24; }
    details summary { outline: none; }
  </style>
</head>
<body>
  <h1>Echo Dashboard</h1>
  <p style="color:#666;">Monitoring multiple concurrent dynamic workflows</p>

  ${cards.length > 0 ? cards : "<p>No workflows found yet.</p>"}

  <p style="margin-top:40px; color:#888; font-size:0.8rem;">
    Auto-generated from Absurd • Run <code>scripts/generate-dashboard.ts</code> to refresh
  </p>
</body>
</html>`;
}

main().catch(console.error);
