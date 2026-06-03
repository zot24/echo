# Agent Swarm System

A lightweight multi-agent swarm built on top of **pi** + **Absurd**.

## Philosophy

- Keep agents narrow and focused
- Use Absurd mainly for durability and shared state
- Avoid heavy, rigid workflow scaffolding
- Make the Knowledge Keeper the core long-term value

This system follows the idea of "a harness for every task" — small, composable agents instead of one monolithic agent.

## Current Agents

| Agent            | Responsibility                              | Status     |
|------------------|---------------------------------------------|------------|
| Repo Scout       | Discover and analyze projects via Mercator  | Working    |
| Knowledge Keeper | Extract how you code, architect, and work   | Core       |
| Planner          | Create lightweight implementation plans     | Working    |

## Available Commands (in pi)

| Command                    | Description                              |
|---------------------------|------------------------------------------|
| `/swarm test`             | Run basic Scout → Knowledge Keeper flow  |
| `/swarm worker`           | Start an Absurd worker                   |
| `/swarm status <task-id>` | Check status of a running/completed task |

## Workflow Patterns (Future)

We are considering implementing some of the powerful multi-agent patterns:

- **Adversarial Verification** — one agent produces, others challenge it
- **Loop-Until-Done** — keep iterating until no major issues remain
- **Fanout-and-Synthesize** — run multiple perspectives in parallel then merge
- **Generate-and-Filter** + **Tournament** — for creative/generative tasks

These will be added gradually while keeping the system lightweight.

## Architecture

See `ARCHITECTURE.md` for the current design principles.

## Status

This is an evolving system. The goal is to create reusable, durable, and improving agent workflows without over-engineering.
