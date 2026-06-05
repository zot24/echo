/**
 * Echo Dashboard Generator (Fully Dynamic)
 */
import { Client } from "pg";
import fs from "node:fs";
import path from "node:path";

const DB_URL = "postgresql://localhost/absurd2";
const OUTPUT_PATH = path.join(process.env.HOME!, ".pi/agent/swarm/dashboard/echo-dashboard.html");

async function main() {
  const client = new Client({ connectionString: DB_URL });
  await client.connect();

  // Discover columns
  const colsRes = await client.query(`
    SELECT column_name 
    FROM information_schema.columns 
    WHERE table_schema = 'absurd' AND table_name = 't_default'
  `);
  const columns = colsRes.rows.map(r => r.column_name);
  console.log("Detected columns:", columns);

  // Build SELECT using only real columns
  const safeColumns = ['task_id', 'state'];
  if (columns.includes('task_name')) safeColumns.push('task_name');
  if (columns.includes('enqueue_at')) safeColumns.push('enqueue_at');
  if (columns.includes('first_started_at')) safeColumns.push('first_started_at');
  if (columns.includes('completed_payload')) safeColumns.push('completed_payload');

  const selectList = safeColumns.join(', ');

  const res = await client.query(`
    SELECT ${selectList}
    FROM absurd.t_default
    ORDER BY ${columns.includes('enqueue_at') ? 'enqueue_at' : 'task_id'} DESC
    LIMIT 30
  `);

  await client.end();

  const workflows = res.rows.map(row => ({
    id: row.task_id,
    name: row.task_name || "workflow",
    status: row.state,
    created: row.enqueue_at || row.first_started_at || new Date(),
    kind: row.completed_payload?.kind || "dynamic",
    iterations: row.completed_payload?.iterations || 1,
    models: [],
  }));

  const html = generateHTML(workflows);
  fs.writeFileSync(OUTPUT_PATH, html);
  console.log("Dashboard generated:", OUTPUT_PATH);
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
