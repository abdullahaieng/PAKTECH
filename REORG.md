Repo reorganization plan (non-destructive)

Goal
- Make the repo easier to maintain and deploy while keeping current structure working.

High-level plan
1. Document current apps: `app/` (storefront) and `admin/` (admin UI). Both are Next.js apps.
2. Keep running state intact. No file moves in first pass.
3. Add `.gitignore` entries to protect secrets and `secure/` folder.
4. Add `DEPLOYMENT.md` listing required env variables, services, and recommended production settings.
5. Optional: after validation, move admin into `apps/admin/` and shared code into `src/` (this is a larger refactor and will require updating many imports).

Rollback
- All changes in first pass are additive (docs, .gitignore, config tweaks). No code moves performed.

Next actions taken now
- Added this `REORG.md` file
- Will add `.gitignore` entries and `DEPLOYMENT.md` with env var checklist

If you approve, I'll apply the non-destructive changes and then proceed to the prioritized bug/security fixes (admin token, env safety, add image host, docs, payment integration tasks).