# pi-config

My [pi](https://github.com/earendil-works/pi) agent config (`~/.pi/agent`), shared via git. Contains no secrets.

## What is in here
| File | Purpose |
|---|---|
| `AGENTS.md` | Global instructions |
| `settings.json` | Models, theme, packages (pi reinstalls them) |
| `open-tui.json` | TUI settings |
| `extensions/`, `extension-settings/` | Local extensions and their settings |
| `mcp.json.example` | MCP servers template (copy to `mcp.json`) |
| `install-skills.sh` | Reinstalls my skills with `npx skills add` |

## What is NOT here (git-ignored)
- Credentials: `auth.json`, `mcp-auth.json`, `trust.json`, `mcp.json` (contains my email).
- Machine-local or regenerated: `sessions/`, `npm/`, `git/`, `install/`, `bin/`, caches.
- `skills/`: symlinks into `~/.agents/skills`; use `install-skills.sh` instead.

## Set up a new machine
```bash
cd ~/.pi/agent
git init -b main && git remote add origin https://github.com/elied-dev/pi-config.git
git fetch && git checkout -f main
cp mcp.json.example mcp.json     # edit email / servers
./install-skills.sh              # skills
```
Then run `/login` in pi. Packages in `settings.json` install on first start.

## Notes
- Pushing needs the `elied-dev` GitHub account (the default `gh` account here is `elied-dy`).
- Regenerate `install-skills.sh` after adding skills (it is built from `~/.agents/.skill-lock.json`).
- Some skill sources (e.g. `DynamicYield/*`) may need private access; the script continues past failures.
