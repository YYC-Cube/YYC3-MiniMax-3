---
name: tos-create-skill
description: Create a new TOS operation skill and auto-verify after creation
---

# Create TOS Skill

Execute this workflow when user needs to create a new TOS operation skill.

## Classification of User Requirements

When creating a skill, classify user requirements into three categories:

1. **TOS Tool Related:** Requirements that can be fulfilled using existing TOS tools (tos-actions). Write specific CLI call instructions into the created skill.

2. **User Provided:** Requirements where user provides their own interface or method. Verify whether it is feasible before including in the skill.

3. **Not Implementable:** Requirements that cannot be fulfilled with existing TOS tools and user has not provided a solution. Inform the user first before proceeding.

## Where TOS Skills Live

TOS skills can be written to OpenClaw's standard skill directories:

| Location | Precedence | Scope |
|----------|------------|-------|
| `<workspace>/skills/` | Highest | Per-agent |
| `<workspace>/.agents/skills/` | High | Per-workspace agent |
| `~/.agents/skills/` | Medium | Shared agent profile |
| `~/.openclaw/skills/` | Medium | Shared (all agents) |
| Bundled (shipped with OpenClaw) | Low | Global |
| `skills.load.extraDirs` | Lowest | Custom shared folders |

**Forbidden paths (do NOT write TOS skills here):**
- TOS plugin root directory
- `~/.openclaw/plugin-skills/`

## Principles

1. **Use TOS tools for all TOS-related operations.** Write specific CLI call instructions. Do NOT use raw Linux commands directly.

   Example calls to write into skill:

   For action-based operations:
   ```
   tos-actions {"actions": ["<entity-action1>", "<entity-action2>"]}
   ```

2. **If skill involves TOS API calls, include authentication step:** Call `auth_get_api_credentials` tool to get credentials (Cookie, X-Csrf-Token, port) before making API calls.

3. **After verification, ask the user whether to save the skill.** Only register the skill when user confirms.

## Workflow

1. Classify user requirements based on the above categories
2. Determine the appropriate skill storage path — ask the user about the desired scope (per-agent, per-workspace, shared, etc.) and select the matching directory from the "Where TOS Skills Live" table above
3. Call `skill-creator` to create the TOS skill following the principles
4. After creation, perform self-test verification
5. Ask user whether to save the skill
6. If user confirms to save, register the skill by running the registration script:
   ```bash
   python3 <this_skill_dir>/scripts/register_skill.py <skill_directory_path>
   ```
7. After registering, call `tos-refresh-skills` tool to refresh the skill list so the new skill takes effect
