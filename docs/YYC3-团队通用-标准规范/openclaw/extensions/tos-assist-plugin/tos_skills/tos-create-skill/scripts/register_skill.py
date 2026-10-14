#!/usr/bin/env python3
"""
Register a TOS user skill path to user-skills.json.

Usage:
    python3 register_skill.py <skill_directory_path>

The script will:
1. Read user-skills.json (create if not exists)
2. Check if the path already exists (dedup)
3. Append the new path
4. Write back
"""

import json
import os
import sys

BASE_DIR = os.path.abspath(os.path.dirname(os.path.realpath(__file__, strict=True)))
USER_SKILLS_LIST_PATH = os.path.abspath(os.path.join(BASE_DIR, "..", "..", "..", "..", "..", "tos-assist-plugin", "user-skills.json"))


def main():
    if not USER_SKILLS_LIST_PATH:
        print("Error: USER_SKILLS_LIST_PATH is not configured.", file=sys.stderr)
        sys.exit(1)

    if len(sys.argv) < 2:
        print("Usage: python3 register_skill.py <skill_directory_path>", file=sys.stderr)
        sys.exit(1)

    skill_path = os.path.abspath(sys.argv[1])

    # Validate the skill directory exists
    if not os.path.isdir(skill_path):
        print(f"Error: Directory does not exist: {skill_path}", file=sys.stderr)
        sys.exit(1)

    skill_md_path = os.path.join(skill_path, "SKILL.md")
    if not os.path.isfile(skill_md_path):
        print(f"Error: SKILL.md not found in: {skill_path}", file=sys.stderr)
        sys.exit(1)

    # Read existing list
    recorded_paths = []
    if os.path.isfile(USER_SKILLS_LIST_PATH):
        try:
            with open(USER_SKILLS_LIST_PATH, "r", encoding="utf-8") as f:
                recorded_paths = json.load(f)
                if not isinstance(recorded_paths, list):
                    print(f"Warning: Invalid format in {USER_SKILLS_LIST_PATH}, resetting to empty list.", file=sys.stderr)
                    recorded_paths = []
        except (json.JSONDecodeError, IOError) as e:
            print(f"Warning: Failed to read {USER_SKILLS_LIST_PATH}: {e}", file=sys.stderr)
            recorded_paths = []

    # Dedup check
    if skill_path in recorded_paths:
        print(f"Skill path already registered: {skill_path}")
        return

    # Append and write back
    recorded_paths.append(skill_path)
    try:
        # Ensure parent directory exists
        parent_dir = os.path.dirname(USER_SKILLS_LIST_PATH)
        if parent_dir and not os.path.isdir(parent_dir):
            os.makedirs(parent_dir, exist_ok=True)

        with open(USER_SKILLS_LIST_PATH, "w", encoding="utf-8") as f:
            json.dump(recorded_paths, f, indent=2, ensure_ascii=False)
        print(f"Skill registered: {skill_path}")
    except IOError as e:
        print(f"Error: Failed to write {USER_SKILLS_LIST_PATH}: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
