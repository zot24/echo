# Swarm System — Agent Development Guide

## Goal

We are building a **lightweight, durable, and model-aware multi-agent swarm system** on top of **pi** and **Absurd**.

The system should allow:

- Natural language or declarative (YAML) requests
- Automatic selection of the best workflow pattern
- Assignment of the right model to each agent based on capabilities
- Durable execution and shared state via Absurd
- Long-term learning through the Knowledge Keeper

## Core Philosophy

- Keep agents **narrow and focused**
- Use **Absurd** for durability and shared state (not heavy orchestration)
- Support **heterogeneous models** (Claude, Grok, etc.) via capability-based routing
- Prefer **composability** over rigid scaffolding
- Make the **Knowledge Keeper** the source of compounding intelligence

## Current Architecture

- **pi** = Control panel + high-level orchestrator
- **Absurd** = Durable task execution + persistent state
- **Model Router** = Assigns models to agents based on required capabilities
- **Agents** = Specialized workers (Scout, Keeper, Planner, Reviewer, Implementer)
- **Workflow Patterns** = Classify-and-Act, Fanout, Adversarial Verification, Generate-and-Filter, Tournament, Loop-Until-Done

## Adding a New Agent

1. Create a new file in `agents/`
2. Register it in `index.ts`
3. Define its capability requirements in `models/agent-requirements.ts`
4. Update `README.md` and `TODO.md`

## Adding a New Workflow Pattern

1. Create a workflow file in `workflows/`
2. Register it in `index.ts`
3. Document the pattern in `README.md`

## Model Routing

Agents declare required capabilities. The router (`models/router.ts`) selects the best available model.

Supported capabilities:
- `reasoning`
- `coding`
- `fast`
- `long-context`
- `cheap`
- `creative`
- `security-review`

Models can be mixed in the same workflow (e.g. Claude for Planner, Grok for Implementer).

## Declarative Workflows

Workflows can be defined in YAML (see `workflows/examples/`). This enables reusable, version-controlled agent flows.

## Future Direction

- Natural language → automatic workflow selection
- Declarative YAML workflow definitions
- Multi-model orchestration in a single workflow
- Stronger adversarial verification and iterative loops
