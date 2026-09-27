# AI Agent Instructions

## Purpose

This file defines the foundational operating rules for AI agents working in this repository.

The repository source code is the ultimate source of truth.
AI-generated documentation may become incomplete or outdated and must never override verified behavior in the source code.

---

## Token Optimization — Use RTK First

Always prioritize **RTK (Rust Token Killer)** commands over raw shell commands and verbose inspection tools. RTK proxies, filters, and compresses output, cutting token consumption by 60–90%:

- **Read files:** Use `rtk read <file>` instead of full file dumps or heavy inspection tools.
- **Search code:** Use `rtk grep <pattern>` instead of raw grep.
- **Find files:** Use `rtk find <pattern>` instead of raw find.
- **List directories:** Use `rtk ls <path>` instead of raw ls.
- **Git operations:** Use `rtk git <cmd>` for all git interactions (`rtk git status`, `rtk git diff`, `rtk git log`, etc.).
- **Chain commands with rtk:** Prefix each command in a chain (e.g. `rtk git add . && rtk git commit -m "msg"`).
- **Diagnostics & analytics:** Use `rtk gain` to view token savings and `rtk discover` to detect missed opportunities.

---

## Before Starting Any Task

Always check if the following context files exist and read them as needed:

1. `.ai/project.md` (High-level project map — always read first)
2. `.ai/context/architecture.md` (Read when designing, refactoring, or navigating cross-component flows)
3. `.ai/context/conventions.md` (Read when writing new code, tests, or styling)
4. `.ai/context/decisions.md` (Read when questioning why a pattern exists or considering major changes)

Then inspect the specific source files relevant to your task.
Do not blindly scan the entire repository.

---

## Bootstrap & Refresh Trigger

If `.ai/project.md` or `.ai/context/architecture.md` does not exist, or when the user asks to:
- "bootstrap the project"
- "analyze the codebase"
- "refresh project context"
- "refresh architecture"
- "rebuild AI context"

Execute the standardized procedure defined in:
`.ai/bootstrap/discovery.md`

---

## Hierarchy of Truth

When sources disagree or provide conflicting signals, resolve with this strict priority:

1. **Source code** (Actual running implementation)
2. **Build and dependency configuration** (`Cargo.toml`, `package.json`, `go.mod`, `pom.xml`, etc.)
3. **Tests** (Verified behavioral contracts)
4. **Configuration files** (Runtime environment, Docker, manifests)
5. **Human documentation** (`README.md`, developer guides)
6. **AI-generated context** (`.ai/` documentation)

---

## Anti-Hallucination ("Do Not Guess")

Never invent:
- APIs, routes, or signatures
- Architecture or system boundaries
- Dependencies or libraries
- Database schemas or ORM behavior
- Environment variables or configurations
- Coding conventions or rules

If something cannot be verified from repository evidence, explicitly record:
`UNKNOWN` (or explain what specific evidence is missing).

---

## Multi-Agent SDLC Team & Workload Routing

When executing tasks with multiple subagents or specialized roles, follow the team configuration defined in `.ai/agents.yaml` and `.ai/routing.yaml`:

### Agent Roles (`.ai/agents/`)
- **Orchestrator / Lead Architect** (`orchestrator.md`): Triages requests, evaluates workload complexity, and coordinates delivery.
- **Spec & Planner** (`planner.md`): Analyzes architectural constraints, assesses risks, and writes atomic implementation plans.
- **Implementation Coder** (`coder.md`): Applies minimal, contiguous edits adhering to `.ai/context/conventions.md`.
- **QA & Debugger** (`debugger.md`): Executes build/test verification and provides root-cause diagnosis.
- **Code & Security Reviewer** (`reviewer.md`): Performs independent adversarial audit against security risks and `.ai/context/decisions.md`.
- **Release & Docs Agent** (`release.md`): Bumps version, consolidates lessons into `.ai/memory/lessons.md`, and cleans working state.

### Workload Complexity & Model Tiering (`.ai/routing.yaml`)
- **Level 1 (Minor / Mechanical):** Fast Path $\to$ Fast / Light model (e.g. Flash-Lite / Haiku / GPT-4o-mini).
- **Level 2 (Standard Feature / Bug):** Standard SDLC $\to$ Standard / Balanced model (e.g. Sonnet / Gemini Pro / GPT-4o).
- **Level 3 (Architectural / Critical):** Rigorous SDLC $\to$ Frontier / Reasoning model (e.g. Opus / o1 / Gemini Ultra).

### Phase-Gated State Bus & Guardrails
Agents use `.ai/memory/active.md` as the centralized hand-off state bus:
`[Intake] -> [Plan] -> [Human Approval (L2/L3)] -> [Code] -> [QA] -> [Review] -> [Release]`

1. **Mandatory Full SDLC for All Fixes:** Whenever the user asks to fix something, resolve an issue, or modify code in the project, the agent **MUST ALWAYS** run the complete SDLC pipeline. Never bypass or skip the **QA & Debugger** or the **Code & Security Reviewer** stages, even for seemingly simple or minor fixes.
2. **Human-in-the-Loop Gate:** For Level 2 and Level 3 tasks, the Orchestrator pauses after planning to receive human approval before coding starts.
3. **Circuit Breaker:** Max 2 feedback loops between Coder, QA, and Reviewer. If unresolved, halt and escalate to human.
4. **Vertical Task Slicing:** Max 5 files or ~200 lines per task slice.
5. **Pre-flight Check:** Verify clean git working tree and passing baseline builds before editing.

---

## Workspace Isolation & `.ai/` Context Protection

When working across branches or worktrees:
1. **Commit `.ai/` into Git:** Always track `.ai/project.md`, `.ai/context/`, `.ai/agents/`, and `.ai/bootstrap/` so isolated branches/worktrees inherit full project context.
2. **Safe Rollbacks:** Never execute destructive commands (`git reset --hard`, `git clean -fd`) that wipe untracked `.ai/` memory or active state. Use targeted file rollbacks:
   ```bash
   git checkout -- <changed_source_files>
   ```
3. **Preserve Memory:** Always commit `.ai/memory/lessons.md` so hard-won debugging lessons persist permanently.

---

## Context Management

- Use `.ai/project.md` as the high-level entry map. Keep it concise.
- Use `.ai/context/architecture.md` for system design and component topology.
- Use `.ai/context/conventions.md` for established idioms and patterns.
- Use `.ai/context/decisions.md` for deliberate architectural decisions (ADRs).
- Use `.ai/memory/active.md` as an ephemeral workspace for multi-step tasks.
- Use `.ai/memory/lessons.md` for durable lessons, tricky bugs, and non-obvious project quirks.

---

## Code Change Rules

Before modifying code:
1. **Understand:** Check the relevant architecture and inspect existing implementations.
2. **Conform:** Adhere to established project patterns and idioms documented in `.ai/context/conventions.md`.
3. **Scope:** Make the smallest appropriate change. Never rewrite unrelated code.
4. **Mandatory Full SDLC for Fixes:** If the user asks to fix anything on the project, **always run the full SDLC pipeline** (`Plan -> Code -> QA Verification -> Security Review -> Release`). QA verification and Security Review must NEVER be skipped or bypassed.
5. **Validate:** Run relevant tests, builds, or linting commands before finishing.
6. **Document:** If you discover a reusable lesson, append it to `.ai/memory/lessons.md`. If your change deliberately alters architecture or conventions, update the corresponding `.ai/context/` file.

