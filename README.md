# pi-config

My [pi](https://github.com/earendil-works/pi) agent config (`~/.pi/agent`). No secrets: `auth.json`, `mcp.json`, sessions, caches are git-ignored.

## Install on a new machine
```bash
cd ~/.pi/agent
git init -b main && git remote add origin https://github.com/elied-dev/pi-config.git
git fetch && git checkout -f main
cp mcp.json.example mcp.json   # edit email / servers
```
Then run `/login` in pi. Packages listed in `settings.json` are reinstalled by pi.
Skills in `~/.agents/skills` are not included.
