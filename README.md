# Innovation Highway - Claude Code Course

A hands-on template project for learning how to use **Claude Code** effectively in real-world software development. This repository contains a fully configured monorepo (Coffee Roulette app) that showcases Claude Code's most powerful features: **CLAUDE.md** configuration files, **Skills** (slash commands), and **Agents** (specialized sub-agents).

Use this project as a playground to experiment with Claude Code's capabilities and learn how to integrate them into your own workflow.

---

## Table of Contents

- [What is Claude Code?](#what-is-claude-code)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [The Template Project: Coffee Roulette](#the-template-project-coffee-roulette)
- [Project Structure](#project-structure)
- [CLAUDE.md - Giving Context to Claude](#claudemd---giving-context-to-claude)
- [Skills - Custom Slash Commands](#skills---custom-slash-commands)
- [Agents - Specialized Sub-Agents](#agents---specialized-sub-agents)
- [Getting Started with the Course](#getting-started-with-the-course)
- [DevContainer Support](#devcontainer-support)

---

## What is Claude Code?

Claude Code is Anthropic's official CLI tool that brings Claude directly into your terminal. It can read your codebase, edit files, run commands, and work alongside you as an AI pair programmer. What makes it powerful is its ability to be **customized per-project** through configuration files, skills, and agents.

---

## Prerequisites

Before starting, make sure you have:

- **Node.js** v18 or higher
- **npm** (comes with Node.js) — this project uses npm exclusively, never yarn or pnpm
- **Git** installed and configured
- **An Anthropic API key** or a Claude Pro/Max subscription
- A terminal (macOS Terminal, iTerm2, Windows Terminal, or VS Code integrated terminal)

---

## Installation

### 1. Install Claude Code

```bash
npm install -g @anthropic-ai/claude-code
```

### 2. Verify the installation

```bash
claude --version
```

### 3. Authenticate

Launch Claude Code and follow the authentication prompts:

```bash
claude
```

You will be asked to log in with your Anthropic account or provide an API key.

### 4. Clone this repository

```bash
git clone <repository-url>
cd coffee-roulette-starter
```

### 5. Set up the project

Copy the environment file and install dependencies:

```bash
cp .env.example .env
cd api && npm install && cd ..
cd web && npm install && cd ..
```

### 6. Start using Claude Code

From the project root, simply run:

```bash
claude
```

Claude will automatically detect and read the `CLAUDE.md` files in your project, gaining full context about your codebase, conventions, and rules.

---

## The Template Project: Coffee Roulette

The codebase used for this course is **Coffee Roulette** — an internal company app that randomly matches colleagues for a coffee chat. It features weekly automatic matching and on-demand instant matching.

| Layer    | Technology           | Version          |
| -------- | -------------------- | ---------------- |
| Backend  | NestJS               | 10+              |
| Frontend | Next.js              | 14+              |
| Database | SQLite               | 3                |
| Auth     | JWT                  | Access + Refresh |
| UI       | Tailwind + shadcn/ui | Latest           |

---

## Project Structure

```
innovation-highway-course/
├── .claude/
│   ├── skills/                    # Custom slash commands
│   │   ├── generate-prd/          # /generate-prd - Create Product Requirements Documents
│   │   ├── generate-prp/          # /generate-prp - Generate implementation plans
│   │   ├── generate-prp-from-gh-issue/  # /generate-prp-from-gh-issue - PRP from GitHub issues
│   │   ├── execute-prp/           # /execute-prp - Execute implementation plans
│   │   ├── claude-md-generator/   # /claude-md-generator - Generate claude.md files from PRD
│   │   ├── explain-code/          # /explain-code - Explain code with diagrams
│   │   └── fix-issue/             # /fix-issue - Fix GitHub issues automatically
│   └── agents/                    # Specialized sub-agents
│       ├── ui-ux-reviewer.md      # UI/UX usability reviewer
│       ├── frontend-react-specialist.md  # Frontend React/Next.js expert
│       └── code-reviewer.md       # Code quality reviewer
├── api/                           # Backend - NestJS
│   └── claude.md                  # Backend-specific instructions for Claude
├── web/                           # Frontend - Next.js
│   └── claude.md                  # Frontend-specific instructions for Claude
├── claude.md                      # Root project instructions for Claude (→ renamed to CLAUDE.md)
├── claude.md.template             # Template for creating new claude.md files
├── .env.example                   # Environment variables template
└── .devcontainer/                 # DevContainer configuration for sandboxed development
```

---

## CLAUDE.md - Giving Context to Claude

The `CLAUDE.md` file (also accepted as `claude.md`) is the most important configuration mechanism in Claude Code. It acts as **persistent instructions** that Claude reads automatically every time it starts a session in your project.

### What goes in a CLAUDE.md?

- **Project overview** — What the project does, its purpose
- **Tech stack** — Frameworks, libraries, versions
- **Conventions** — Naming rules, code style, language preferences
- **Architecture** — Directory structure, patterns, data flow
- **Boundaries** — What Claude should always do, ask about first, or never do
- **Setup instructions** — How to install and run the project
- **Troubleshooting** — Common errors and their fixes

### Hierarchical CLAUDE.md files

Claude Code supports CLAUDE.md files at multiple levels, and they **stack**:

```
innovation-highway-course/
├── claude.md          ← Root: global conventions, stack overview, cross-project rules
├── api/
│   └── claude.md      ← Backend: NestJS patterns, DB schema, API endpoints, auth strategy
└── web/
    └── claude.md      ← Frontend: Next.js routes, components, shadcn/ui usage, state management
```

When Claude works inside `api/`, it reads **both** the root `claude.md` and `api/claude.md`. This lets you define global rules once and add component-specific details where needed.

### Why it matters

Without a CLAUDE.md, Claude has to guess your conventions and make assumptions about your project. With a well-written CLAUDE.md, Claude:

- Follows your exact coding standards
- Knows your project architecture
- Respects your boundaries (e.g., never commits secrets)
- Produces code that fits naturally into your codebase

### Template

This repo includes a `claude.md.template` file you can use as a starting point for new projects or components.

---

## Skills - Custom Slash Commands

Skills are **custom slash commands** that extend Claude Code with reusable, project-specific workflows. They live in `.claude/skills/` and each skill is defined by a `SKILL.md` file.

### How skills work

When you type a slash command like `/generate-prd` in Claude Code, it loads the corresponding `SKILL.md` file, which contains detailed instructions, templates, and workflows that guide Claude through a specific task.

### Available skills in this project

| Skill                     | Command                                   | Description                                                                                                                                                                                   |
| ------------------------- | ----------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **PRD Builder**           | `/generate-prd`                           | Guides you through creating a Product Requirements Document with discovery questions, user personas, feature scoping (MVP/nice-to-have/out-of-scope), and success metrics.                    |
| **PRP Generator**         | `/generate-prp <feature-file>`            | Generates a comprehensive Prompt Requirements Plan from a feature file, including codebase research, external documentation, and an implementation blueprint designed for one-pass execution. |
| **PRP from GitHub Issue** | `/generate-prp-from-gh-issue <issue-url>` | Same as above but takes a GitHub issue as input. Reads the issue, researches the codebase, and produces a detailed implementation plan.                                                       |
| **Execute PRP**           | `/execute-prp <prp-file>`                 | Takes a PRP file and executes it — implements the feature, runs validation gates, and iterates until all checks pass.                                                                         |
| **Claude.md Generator**   | `/claude-md-generator`                    | Generates technical `claude.md` files for each stack component from a PRD. Creates backend, frontend, and mobile documentation with architecture, conventions, and troubleshooting.           |
| **Explain Code**          | `/explain-code`                           | Explains code using analogies, ASCII diagrams, step-by-step walkthroughs, and highlights common gotchas. Great for learning and onboarding.                                                   |
| **Fix Issue**             | `/fix-issue <issue-number>`               | Reads a GitHub issue, implements the fix, creates a branch, commits, pushes, and opens a pull request — all automatically.                                                                    |

### Creating your own skills

To create a new skill, add a folder under `.claude/skills/` with a `SKILL.md` file:

```
.claude/skills/my-skill/
└── SKILL.md
```

The `SKILL.md` file uses YAML frontmatter for metadata and markdown for the instructions:

```markdown
---
name: my-skill
description: Short description of what this skill does
---

# My Skill

Instructions for Claude on how to execute this skill...
```

---

## Agents - Specialized Sub-Agents

Agents are **autonomous specialized workers** that Claude Code can delegate tasks to. They run as sub-processes with their own context, tools, and expertise. Agents are defined as markdown files in `.claude/agents/`.

### How agents work

When Claude detects a task that matches an agent's specialty, it automatically delegates the work. Each agent has:

- A specific **area of expertise** (UI review, frontend code, code review)
- Access to specific **tools** (file reading, searching, running commands)
- Its own **persistent memory** that accumulates project knowledge across sessions
- A defined **model** (can use a different Claude model than the main session)

### Available agents in this project

| Agent                         | File                           | Purpose                                                                                                                                                                          |
| ----------------------------- | ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **UI/UX Reviewer**            | `ui-ux-reviewer.md`            | Reviews interfaces for usability, accessibility, visual hierarchy, and emotional design. Evaluates components from the end user's perspective and provides prioritized feedback. |
| **Frontend React Specialist** | `frontend-react-specialist.md` | Expert in TypeScript, React, Next.js, and shadcn/ui. Builds pages, components, forms, handles routing, and debugs frontend issues following strict coding standards.             |
| **Code Reviewer**             | `code-reviewer.md`             | Reviews code changes for quality, security, readability, error handling, and test coverage. Provides feedback organized by priority (critical, warnings, suggestions).           |

### Agent memory

Agents have **persistent memory** stored in `.claude/agent-memory/<agent-name>/`. This means they learn from previous interactions and build institutional knowledge about your project over time — remembering patterns, conventions, and decisions from past sessions.

### Creating your own agents

Add a markdown file to `.claude/agents/`:

```markdown
---
name: my-agent
description: "What this agent does and when to use it"
model: sonnet
---

You are an expert in [domain]...

## Your responsibilities

- ...

## Guidelines

- ...
```

---

## Getting Started with the Course

Here are some things you can try to learn Claude Code's features:

### 1. Explore CLAUDE.md files

Open Claude Code in the project root and ask:

```
What conventions does this project follow?
```

Claude will read the CLAUDE.md files and explain the project rules.

### 2. Try a skill

Generate a PRD for a new feature:

```
/generate-prd
```

Or explain how a piece of code works:

```
/explain-code api/src/auth/auth.service.ts
```

### 3. See agents in action

Create a frontend component and watch the UI/UX reviewer agent provide feedback:

```
Create a login page for the web app
```

### 4. The full workflow

Experience the complete product development cycle:

1. `/generate-prd` — Define what to build
2. `/claude-md-generator` — Generate technical specs
3. `/generate-prp <feature>` — Plan the implementation
4. `/execute-prp <prp-file>` — Implement the feature
5. Agents review the code and UI automatically

---

## DevContainer Support

This project includes a `.devcontainer/` configuration for running Claude Code in a sandboxed Docker environment. This is useful for:

- Isolating Claude's file system access
- Running in CI/CD environments
- Ensuring a consistent development environment across team members

To use it, open the project in VS Code and select **"Reopen in Container"** when prompted (requires the Dev Containers extension).

---

## Environment Variables

Copy `.env.example` to `.env` and configure:

```env
# API
JWT_SECRET=your-jwt-secret-here
JWT_REFRESH_SECRET=your-jwt-refresh-secret-here
DATABASE_PATH=./db.sqlite

# Web
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_APP_NAME=Coffee Roulette
```

---

## License

This project is provided as educational material for the Innovation Highway course on Claude Code.
