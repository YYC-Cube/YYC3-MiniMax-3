---
name: tos-create-general-skill
description: Create a non-TOS OpenClaw skill (general-purpose skill). Use when user needs to create a skill that is NOT related to TOS operations.
---

# Create General (Non-TOS) OpenClaw Skill

Execute this skill when the user needs to create a skill that is NOT related to TOS operations.

## When to Use

- User wants to create a new skill for general OpenClaw tasks
- The skill being created does NOT involve TOS CLI tools (tos-actions, auth_*)
- If the skill IS TOS-related, use `tos-create-skill` instead

## Where Skills Live

Non-TOS skills must be written to OpenClaw's standard skill directories:

| Location | Precedence | Scope |
|----------|------------|-------|
| `<workspace>/skills/` | Highest | Per-agent |
| `<workspace>/.agents/skills/` | High | Per-workspace agent |
| `~/.agents/skills/` | Medium | Shared agent profile |
| `~/.openclaw/skills/` | Medium | Shared (all agents) |
| Bundled (shipped with OpenClaw) | Low | Global |
| `skills.load.extraDirs` | Lowest | Custom shared folders |

**Forbidden paths (do NOT write non-TOS skills here):**
- TOS plugin root directory
- `~/.openclaw/plugin-skills/`

## Workflow

1. Confirm with the user what the skill should do and that it is NOT TOS-related
2. Determine the appropriate skill storage path — ask the user about the desired scope (per-agent, per-workspace, shared, etc.) and select the matching directory from the "Where Skills Live" table above
3. Call `skill-creator` skill — follow its full creation process

## Important Notes

- Do NOT call `tos-refresh-skills` — that tool only refreshes TOS plugin skills, not OpenClaw's general skill list
