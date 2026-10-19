# Project installation provenance

Installed for Codex at project scope on 2026-10-19.

- Official repository: https://github.com/pbakaus/impeccable
- Source commit: `0665bd812ae0908fcab17b96fd4f840defb882d9`
- Skill version: 4.6.0; engine version: 0.1.15.
- Requested command: `npx impeccable install --providers=codex --scope=project` (npm cache redirected to `/workspace/.npm-cache` for this cloud machine).
- Installer exited 1 with the exact error:

```text
Download failed: Could not verify skill bundle: https://impeccable.style/api/download/bundle/universal: Proxy failed to connect. Nothing was installed; retry or update the CLI. If this persists, report it at https://github.com/pbakaus/impeccable/issues/479
```

The successful fallback follows README Option 5 (Copy from Repository): the official committed `.agents/skills/impeccable` output and `.codex/hooks.json` were copied from the GitHub source archive for the commit above. LICENSE and NOTICE.md were retained. `.codex/skills/impeccable` is a relative symlink to the installed skill so the official hook manifest's launcher path resolves without editing that manifest. Existing application files were not touched by installation.

The installed launcher successfully ran `context` using the matching 0.1.15 engine already supplied by the official npm platform package (`IMPECCABLE_BIN` override). Engine binaries and npm caches are not committed. The launcher supports its standard pinned-engine discovery/download on other machines.

Codex hook trust has not been approved or tested here. Official instructions say to open `/hooks` in Codex after installation and approve the project hook when prompted. Installation does not assert automatic hook execution.
