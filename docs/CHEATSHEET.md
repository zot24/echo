# Swarm Cheat Sheet – What to Actually Type to pi

This is the simple, no-jargon version of how to use the swarm right now.

**Tip:** To actually *see* what’s happening, always have the Habitat dashboard open (instructions at the bottom of this file).

---

## Quick Commands You Can Use Today

| What you want to do                        | What to type in pi                              | What happens |
|--------------------------------------------|--------------------------------------------------|--------------|
| Basic test (scout your projects)           | `/swarm test`                                    | Explores your repos and stores basic knowledge |
| Check what the swarm already knows about you | `/swarm knowledge`                             | Shows your saved patterns |
| Start a worker (needed for bigger tasks)   | `/swarm worker`                                  | Keeps the swarm running in the background |
| Watch everything happening                 | `habitat run -db-name absurd2` then open browser | Visual dashboard of all tasks |
| Full authentication improvement example    | Spawn task: `improve-auth-across-projects`       | Runs the complete multi-agent workflow |

---

## Real-World Prompts You Can Use

### 1. Start a brand new Astro project with a dashboard

**Type this:**
```
Create a new Astro project that includes a simple dashboard for editing pages. Use the swarm to plan and set it up.
```

**What the swarm will do:**
- Scout if you already have similar projects
- Remember your preferred Astro setup (if you’ve done it before)
- Create a plan
- Hand off the actual creation to a sub-agent
- Review the result

### 2. Make changes to an existing project

**Type this:**
```
Improve authentication across all my projects using the swarm
```

or

```
Add a dashboard page to my Astro site that lets me edit content
```

**What the swarm will do:**
- Look at your existing code
- Use knowledge it already has about how you write auth / dashboards
- Make a plan
- Do the work (or ask a sub-agent to do it)
- Check its own work before finishing

### 3. Make the swarm remember your preferences

Just talk to it normally while working. Examples:
- “I prefer Tailwind + TypeScript for new projects”
- “I like my dashboards to have a sidebar on the left”
- “For Astro sites I always use the content collections pattern”

The Knowledge Keeper will store this and use it on future tasks.

---

## More Ready-to-Use Prompts

### Starting new projects
- `Start a new Astro project with a content dashboard for editing pages`
- `Create a new Next.js app with authentication already set up`
- `Build a simple portfolio site using Astro and Tailwind`

### Making changes / refactoring
- `Refactor all my API routes to use better error handling`
- `Add user authentication to my existing Astro blog`
- `Update the dashboard so it supports drag-and-drop page reordering`
- `Standardize how I handle forms across all my projects`

### Reviewing & improving
- `Review my current authentication code and suggest improvements`
- `Find and fix inconsistent patterns across my repositories`
- `Improve the performance of my dashboard pages`

---

## How to Actually See What the Swarm Is Doing

The swarm works in the background, so you need to watch it:

1. **Start a worker first** (very important):
   ```
   /swarm worker
   ```

2. **Open the visual dashboard** (best way to see everything):
   ```
   habitat run -db-name absurd2
   ```
   Then open http://localhost:7890 in your browser. You’ll see tasks, progress, and results.

3. **Check what it already knows about you**:
   ```
   /swarm knowledge
   ```

4. **Check status of a specific task**:
   ```
   /swarm status <task-id>
   ```

**For /swarm test specifically**:
- Run the command
- Open Habitat dashboard
- You should see the "test-swarm-scout-then-keeper" task appear
- After it finishes, run `/swarm knowledge` to see what it learned

---

## Current Reality Check

- `/swarm test` currently only does the basic scout + knowledge step.
- The big workflows (`improve-auth-across-projects`, etc.) work when you have a worker running.
- The system is designed so that over time it gets better at your specific style.

---

## Pro Tips

- Always run `/swarm worker` first if you want bigger tasks to complete.
- Use the Habitat dashboard to see what’s actually happening.
- The more you use it, the smarter it gets because of the persistent knowledge.

Want me to add more specific prompt examples (like “refactor X”, “add feature Y”, “start new project Z”)?