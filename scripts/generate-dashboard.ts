/**
 * Echo Project Dashboard (Project-centric)
 */
import { Client } from "pg";
import fs from "node:fs";
import path from "node:path";

const DB_URL = "postgresql://localhost/absurd2";
const OUTPUT_PATH = path.join(process.env.HOME!, ".pi/agent/swarm/dashboard/echo-dashboard.html");

async function main() {
  const client = new Client({ connectionString: DB_URL });
  await client.connect();

  const colsRes = await client.query(`
    SELECT column_name 
    FROM information_schema.columns 
    WHERE table_schema = 'absurd' AND table_name = 't_default'
  `);
  const columns = colsRes.rows.map(r => r.column_name);

  const safeCols = ['task_id', 'state'];
  if (columns.includes('task_name')) safeCols.push('task_name');
  if (columns.includes('enqueue_at')) safeCols.push('enqueue_at');
  if (columns.includes('completed_payload')) safeCols.push('completed_payload');

  const res = await client.query(`
    SELECT ${safeCols.join(', ')}
    FROM absurd.t_default
    ORDER BY ${columns.includes('enqueue_at') ? 'enqueue_at' : 'task_id'} DESC
    LIMIT 40
  `);

  await client.end();

  // Group by project when available
  const byProject: Record<string, any[]> = {};

  for (const row of res.rows) {
    const payload = row.completed_payload || {};
    const project = payload.project || { name: "Unknown Project", path: "—" };

    const key = project.name;
    if (!byProject[key]) byProject[key] = [];

    byProject[key].push({
      name: row.task_name || "workflow",
      status: row.state,
      kind: payload.kind || "dynamic",
      iterations: payload.iterations || 1,
      path: project.path,
      created: row.enqueue_at || new Date(),
    });
  }

  const html = generateHTML(byProject);
  fs.writeFileSync(OUTPUT_PATH, html);
  console.log("Project dashboard generated:", OUTPUT_PATH);
}

function generateHTML(byProject: Record<string, any[]>): string {
  let html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Echo • Projects</title>
  <style>
    body { font-family: system-ui, sans-serif; margin: 40px; background: #f8f9fa; }
    .project { background: white; border-radius: 12px; padding: 24px; margin-bottom: 30px; box-shadow: 0 2px 6px rgba(0,0,0,0.06); }
    .project h2 { margin: 0 0 4px 0; }
    .path { font-family: monospace; color: #666; font-size: 0.85rem; }
    .workflow { border-top: 1px solid #eee; padding-top: 12px; margin-top: 12px; }
    .status { padding: 2px 8px; border-radius: 9999px; font-size: 0.75rem; }
    .completed { background: #d4edda; color: #155724; }
    .running { background: #fff3cd; color: #856404; }
  </style>
</head>
<body>
  <h1>Echo Dashboard</h1>
  <p>Projects &amp; Workflows</p>
`;

  for (const [projectName, workflows] of Object.entries(byProject)) {
    const first = workflows[0];
    html += `
    <div class="project">
      <h2>${projectName}</h2>
      <div class="path">${first.path}</div>
`;

    for (const w of workflows) {
      html += `
      <div class="workflow">
        <strong>${w.name}</strong> 
        <span class="status ${w.status}">${w.status}</span><br>
        <span style="font-size:0.85rem; color:#555;">
          ${w.kind} • ${w.iterations} iter
        </span>
      </div>`;
    }

    html += `</div>`;
  }

  html += `</body></html>`;
  return html;
}

main().catch(console.error);
