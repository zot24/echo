# Visual QA Templates + Dynamizing System

## Goal

Create a reusable, extensible Visual Design QA system that works across any project using:

- **Base Templates** (default + community)
- **Dynamizing Layer** (automatically adds extra steps/agents on top of the base template)

## Template Structure

A template is a YAML (or JSON) definition with the following shape:

```yaml
name: visual-qa-web-default
kind: visual-qa
description: Default Visual QA template for web projects
version: 1

base_steps:
  - id: capture
    agent: playwright-capture
    input:
      urls: ["http://localhost:3000"]

  - id: review
    agent: web-ui-reviewer
    depends_on: [capture]

control:
  max_iterations: 1

dynamize_rules:
  - if: has_tailwind
    add:
      - agent: tailwind-consistency-reviewer
  - if: has_dark_mode
    add:
      - agent: dark-mode-reviewer
  - if: has_a11y
    add:
      - agent: accessibility-reviewer
```

## Dynamizing Rules

Rules can be based on:
- Project files (`package.json`, `tailwind.config.js`, etc.)
- Detected tech stack
- User-provided flags

## Marketplace (Future)

Templates can be published and discovered. Each template declares:
- Supported project types
- Required agents
- Optional dynamize rules

## First Templates to Build

1. `visual-qa-web-default` (MVP)
2. `visual-qa-design-system`
3. `visual-qa-mobile`

## Integration with Echo

- `dynamic-generator` will support loading base templates
- `dynamic-executor` will run the final (possibly dynamized) workflow
