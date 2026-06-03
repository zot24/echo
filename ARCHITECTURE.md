# Agent Swarm Architecture (Adjusted)

## Core Philosophy

This swarm system follows these principles:

- **pi** remains the control panel and flexible orchestrator
- **Absurd** is used primarily for durability and shared state, not complex workflow orchestration
- Agents are **narrow and focused** (one job each)
- The **Knowledge Keeper** is the most important long-term component
- We avoid heavy, rigid workflow scaffolding

## Components

| Component          | Role                                              | Durability Responsibility          |
|--------------------|---------------------------------------------------|------------------------------------|
| pi                 | Control panel + high-level orchestration          | Session-level (handled by pi)      |
| Absurd             | Task durability + shared state storage            | Task results, checkpoints          |
| Repo Scout         | Discover and analyze projects (via Mercator)      | None (stateless)                   |
| Knowledge Keeper   | Extract and structure how you work                | Stores patterns and decisions      |
| Planner            | Create lightweight implementation plans           | None                               |
| Orchestrator       | Simple coordination (kept minimal)                | Uses Absurd for state              |

## What We Are NOT Building

- A complex step-based workflow engine (like Vercel DurableAgent)
- Heavy predefined flows with strict gates
- Over-engineered scaffolding

## What We Are Building

- A lightweight system of composable agents
- Persistent knowledge that improves over time
- Simple, durable task execution via Absurd
- A foundation that can grow without becoming rigid

## Next Priorities

1. Make Knowledge Keeper the strongest component
2. Keep all agents narrow and reusable
3. Maintain flexibility in how workflows are composed
