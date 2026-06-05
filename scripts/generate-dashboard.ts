/**
 * Echo Dashboard Generator
 * 
 * Connects to Absurd Postgres and regenerates echo-dashboard.html
 * with real workflow data.
 */
import { Client } from "pg";
import fs from "node:fs";
import path from "node:path";

const DB_URL = "postgresql://localhost/absurd2";
const OUTPUT_PATH = path.join(process.env.HOME!, ".pi/agent/swarm/dashboard/echo-dashboard.html");

async function main() {
  const client = new Client({ connectionString: DB_URL });
  await client.connect();

  // Query recent tasks (simplified)
  const res = await client.query(`
    SELECT task_id, name, state, created_at, result
    FROM absurd.t_default
    ORDER BY created_at DESC
    LIMIT 20
  `);

  await client.end();

  const workflows = res.rows.map(row => ({
    id: row.task_id,
    name: row.name || "unknown",
    status: row.state,
    created: row.created_at,
    kind: row.result?.kind || "unknown",
    iterations: row.result?.iterations || 1,
  }));

  const html = generateHTML(workflows);
  fs.writeFileSync(OUTPUT_PATH, html);
  console.log("Dashboard generated:", OUTPUT_PATH);
}

function generateHTML(workflows: any[]): string {
  const rows = workflows.map(w => `
    <div class="workflow">
      <h3>${w.name}</h3>
      <div class="kind">kind: ${w.kind}</div>
      <div class="meta">Iterations: ${w.iterations} • Created: ${new Date(w.created).toLocaleString()}</div>
      <span class="status ${w.status}">${w.status}</span>
    </div>
  `).join("\n");

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Echo Dashboard</title>
  <style>
    body { font-family: system-ui, sans-serif; margin: 40px; background: #f8f9fa; }
    .workflow { background: white; border: 1px solid #ddd; border-radius: 8px; padding: 20px; margin-bottom: 16px; }
    .kind { font-size: 0.85rem; color: #666; }
    .meta { color: #555; font-size: 0.9rem; }
    .status { padding: 2px 8px; border-radius: 4px; font-size: 0.8rem; }
    .completed { background: #d4edda; color: #155724; }
    .running { background: #fff3cd; color: #856404; }
    .failed { background: #f8d7da; color: #721c24; }
  </style>
</head>
<body>
  <h1>Echo Dashboard</h1>
  <p>Live data from Absurd</p>
  ${rows}
</body>
</html>`;
}

main().catch(console.error);
