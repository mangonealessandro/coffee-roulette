---
name: generate-prd
description: Create Product Requirements Documents (PRDs) for software projects. Define what to build, why it matters, who will use it, and how to measure success. Use when starting new projects, defining features, or aligning stakeholders on product vision. Guides through problem definition, user personas, feature scoping with MVP/nice-to-have/out-of-scope categorization, and success metrics.
---

# PRD Builder

Transform ideas into structured Product Requirements Documents.

## When to use

This skill activates when you need to:

- Define requirements for a new software product or feature
- Structure an idea into actionable specifications
- Align stakeholders on product scope and goals
- Document user needs and success criteria before development

## Core workflow

1. **Discovery** - Problem, context, constraints
2. **User research** - Personas and pain points
3. **Solution design** - High-level approach
4. **Feature scoping** - MVP vs nice-to-have vs out-of-scope
5. **Success metrics** - Measurable goals
6. **Documentation** - Generate PRD.md file

## Discovery questions

**Problem:**

- What problem are you solving?
- Who experiences this problem?
- What's the impact? (time, cost, frustration)

**Context:**

- What exists today? (tools, competitors, manual processes)
- Why now?
- What if we don't solve this?

**Constraints:**

- Timeline?
- Team size?
- Budget or tech limitations?

## User personas template

```markdown
### [Name], [Role]

- **Context:** [Environment, team, tools]
- **Pain Points:**
  - [Specific frustration 1]
  - [Specific frustration 2]
- **Goals:** [What they want to accomplish]
- **Tech Level:** [Beginner/Intermediate/Expert]
```

## Feature scoping pattern

```markdown
### Must-Have (MVP - [Timeline])

- [ ] **[Feature]:** [Description]
  - Why critical: [Reason]

### Should-Have (Post-MVP)

- [ ] **[Feature]:** [Description]
  - Impact: [Medium/High]
  - Effort: [Small/Medium/Large]

### Won't-Have (Out of Scope)

- ❌ **[Feature]:** [Why excluded]
```

## Success metrics template

```markdown
### Business Goals

- [Goal]: [Increase/Decrease] [metric] by [X%] in [timeline]

### KPIs

| Metric | Baseline  | Target | Measurement   |
| ------ | --------- | ------ | ------------- |
| [Name] | [Current] | [Goal] | [How tracked] |

### Non-Functional

- Performance: [Requirement]
- Security: [Requirement]
- Scalability: [Requirement]
```

## Final PRD structure

```markdown
# [Project] - PRD

## Executive Summary

Problem, Solution, Value

## Background & Context

Current situation, Why now

## Goals & Success Metrics

Business goals, KPIs, User criteria

## User Personas

[2-3 personas with pain points]

## User Stories

Top 5-10 critical stories

## Solution Overview

High-level approach

## Core User Flow

Step-by-step happy path + edge cases

## Functional Requirements

Must-Have, Should-Have, Won't-Have

## Non-Functional Requirements

Performance, Security, Scalability

## Open Questions

Unresolved decisions

## Dependencies & Risks

Blockers and mitigation
```

## Quality checks

Before finalizing:

- [ ] Problem is clear and specific
- [ ] Users are named personas with context
- [ ] MVP is truly minimal (achievable in stated timeline)
- [ ] Metrics are measurable numbers
- [ ] Out-of-scope is explicit
- [ ] Open questions captured

## Conversation style

**Less technical users:**

- Avoid jargon (use "first version" not "MVP")
- Ask scenario questions: "Walk me through Sarah's Tuesday morning"

**Technical users:**

- Use industry terms: "API surface", "event-driven"
- Reference frameworks: "RICE scoring?", "Jobs-to-be-Done?"

**Pacing:**

- Ask 2-3 questions per turn, not 10
- Build on previous answers
- Allow "I don't know" → offer defaults or mark as Open Question

## Output

Save PRD.md to working directory. After completion, offer to generate technical specifications (claude.md files) using the stack-claude-md-generator skill.

## Lite PRD variant

For small internal tools, use minimal structure:

```markdown
# [Tool] - PRD Lite

## Problem

[What doesn't work today?]

## Users & Scenarios

- **[Role]:** needs to [task]

## Solution

[How it works - 3 sentences]

## Features

**Must-have:** [List]
**Out of scope:** ❌ [List with reasons]

## Success

- [Metric]: [Target]
```
