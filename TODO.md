# Swarm System TODO

## Core Agents
- [ ] Create `Monitor` agent (proactive repo watching, git hooks, scheduled scans)
- [ ] Create `MemoryKeeper` agent (long-term semantic memory across projects)
- [ ] Improve `Reviewer` agent to do real critique (not placeholder)
- [ ] Create `Architect` agent (high-level system design decisions)

## Workflow Patterns
- [ ] Make `Loop-Until-Done` support real agent-based condition checking
- [ ] Implement full `Fanout-and-Synthesize` with parallel agent execution + merge
- [ ] Add `Generate-and-Filter` with actual generation agents
- [ ] Add `Tournament` with real pairwise judging

## Execution & Delegation
- [ ] Make `Implementer` actually trigger pi subagent handoff (real delegation)
- [ ] Add support for multiple executors (`pi-subagent`, `openhands`, `claude-code`, `direct`)
- [ ] Create executor registry / plugin system
- [ ] Add timeout + retry logic for executor calls

## Persistence & Memory
- [ ] Store persistent knowledge in Absurd (instead of local JSON file)
- [ ] Add vector search for semantic memory retrieval
- [ ] Create `KnowledgeBase` table in Absurd schema
- [ ] Add knowledge versioning and rollback

## Commands & UX (pi extension)
- [ ] Add `/swarm dashboard` (open Habitat in browser)
- [ ] Add `/swarm pause` and `/swarm resume`
- [ ] Improve `/swarm status` output formatting
- [ ] Add progress streaming for long workflows
- [ ] Add confirmation prompts before spawning large workflows

## Documentation
- [ ] Write full installation + quickstart guide
- [ ] Add architecture diagram (visual)
- [ ] Document all agents with input/output examples
- [ ] Create example workflows with expected output
- [ ] Add contribution guide for new agents/patterns

## Infrastructure & Tooling
- [ ] Add Habitat setup script (`setup-habitat.sh`)
- [ ] Create one-command setup for the entire swarm system
- [ ] Add health check for Absurd + Postgres connection
- [ ] Add graceful shutdown for workers
- [ ] Add structured logging across all swarm components

## Advanced / Future Ideas
- [ ] Integrate with pi's native subagent extension more deeply
- [ ] Add multi-user / multi-project isolation in knowledge base
- [ ] Build a lightweight web UI on top of Habitat (swarm-specific views)
- [ ] Add cost / token tracking per workflow
- [ ] Support for human-in-the-loop approval steps
- [ ] Add "Agent Marketplace" concept (shareable agent definitions)

## Polish & Maintenance
- [ ] Add tests for all agents and workflows
- [ ] Add TypeScript strict mode + linting
- [ ] Create release process and versioning
- [ ] Set up CI for the swarm repo
