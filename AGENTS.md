# Global Pi Instructions

## Tools
- Reach for MCP tools first; use browser navigation only when no MCP covers the task.
- When several MCP servers match (e.g. multiple GitHub/Atlassian accounts), ask which one before calling.

## Working style
- Keep replies concise; show file paths.
- Ask before destructive or irreversible actions (force-push, deleting branches, prod changes).
- Follow each repo's own AGENTS.md and conventions over these defaults.

## Delegation inside Herdr
- When `$HC_TERMINAL_ID` is set (you run in a Herdr terminal), never use the `Agent` or `SubagentWorkflow` tools, and ignore any skill instruction to "dispatch a subagent" or "spawn sub-agents". Delegate with real agents through `hc` instead: load the `hc` skill and follow its manual.
- Start every agent with `hc-agent <name> <cwd> "<exact scope; no subagents; report with hc send $HC_TERMINAL_ID when done or stuck>" [program]` (`~/.local/bin/hc-agent`, default program `pi`). Never call `hc run` for agents directly: children of `hc run` lack this shell's corporate-CA settings (`NODE_USE_SYSTEM_CA`, `NODE_EXTRA_CA_CERTS`), so model calls fail with "Connection error", and they get no pane so they never appear on the Herdr board. `hc-agent` passes the CA settings and gives the agent its own named tab. If an agent still shows "Connection error", compare its environment with yours before retrying.
- Names are short and specific (`review-auth`, `fix-login-test`, `research-bedrock-quota`), never `agent1`.
- Orchestrate: run independent agents in parallel, keep working, collect with `hc wait --children all|any`, read the real result (a file path they send, or `hc read`) before you report. Clean up only your own children (`hc kill`, `hc rm`) once their work is accepted.
- Wait in short steps: `hc wait ... --timeout 60` (1 minute), never longer, so you react quickly to messages, conflicts and user input. On `reason: timeout`, check state and wait again.
- Do not idle while agents work: start the next slices too. When a slice is blocked by an open PR, branch it from that PR's branch (stacked branch, PR based on it) instead of waiting for the merge.
- Without `$HC_TERMINAL_ID` (no Herdr), the normal subagent tools are fine.

## Pointers
- Writing or editing skills / AGENTS.md → load `writing-for-agents`.

## Slides
- All open-slide decks live in `~/Documents/slides` (shared config, themes, assets). Never scaffold a new workspace (`npx @open-slide/cli init`); add `slides/<id>/` there. Run its `dev` script from that directory.
