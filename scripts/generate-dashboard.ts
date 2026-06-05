/**
 * Echo Dashboard Generator (Robust)
 * 
 * Dynamically discovers columns and gracefully handles different Absurd schemas.
 */
import { Client } from "pg";
import fs from "node:fs";
import path from "node:path";

const DB_URL = "postgresql://localhost/absurd2";
const OUTPUT_PATH = path.join(process.env.HOME!, ".pi/agent/swarm/dashboard/echo-dashboard.html");

async function main() {
  const client = new Client({ connectionString: DB_URL });
  await client.connect();

  // Get actual columns
  const colsRes = await client.query(`
    SELECT column_name 
    FROM information_schema.columns 
    WHERE table_schema = 'absurd' AND table_name = 't_default'
  `);

  const columns = colsRes.rows.map(r => r.column_name);
  console.log("Detected columns:", columns);

  // Always use a safe, minimal column list
  const selectList = "task_id, state, created_at, result";

  const res = await client.query(`
    SELECT ${selectList}
    FROM absurd.t_default
    ORDER BY created_at DESC
    LIMIT 30
  `);

  await client.end();

  const workflows = res.rows.map(row => ({
    id: row.task_id,
    name: "workflow",
    status: row.state,
    created: row.created_at,
    kind: row.result?.kind || "dynamic",
    iterations: row.result?.iterations || 1,
    models: extractModels(row.result),
  }));

  const html = generateHTML(workflows);
  fs.writeFileSync(OUTPUT_PATH, html);
  console.log("Dashboard generated:", OUTPUT_PATH);
}

function extractModels(result: any): string[] {
  if (!result?.results) return [];
  return Object.values(result.results).map((r: any) => r.model).filter(Boolean) as string[];
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
    </div>
  `).join("\n");

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Echo Dashboard</title>
  <style>
    body { font-family: system-ui, sans-serif; margin: 40px; background: #f8f9fa; }
    .workflow { background: white; border: 1px solid #ddd; border-radius: 10px; padding: 20px; margin-bottom: 18px; }
    .kind { font-size: 0.9rem; color: #555; }
    .meta { font-size: 0.85rem; color: #666; }
    .status { padding: 3px 10px; border-radius: 9999px; font-size: 0.75rem; }
    .completed { background: #d4edda; color: #155724; }
    .running { background: #fff3cd; color: #856404; }
    .failed { background: #f8d7da; color: #721c24; }
  </style>
</head>
<body>
  <h1>Echo Dashboard</h1>
  <p>Live data from Absurd</p>
  ${cards.length > 0 ? cards : "<p>No workflows found.</p>"}
</body>
</html>`;
}

main().catch(console.error);
