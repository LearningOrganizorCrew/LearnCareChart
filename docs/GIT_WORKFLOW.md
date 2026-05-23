# GitHub Flow

This repository uses GitHub Flow for a small MVP team. `main` is always the deployable branch, and every change goes through a Pull Request before production deployment.

## Branch Roles

| Branch | Purpose |
| --- | --- |
| `main` | Production branch. Vercel deploys this branch automatically. |
| `feature/*` | Product or UI feature work. |
| `fix/*` | Bug fixes. |
| `chore/*` | Project setup, tooling, configuration, dependency updates. |
| `docs/*` | Documentation-only work. |
| `ai/codex-*` | Branches created with Codex assistance. |
| `ai/claude-*` | Branches created with Claude Code assistance. |

## Team Responsibilities

| Role | Responsibilities |
| --- | --- |
| Project lead | Manage GitHub Issues, Pull Requests, Vercel deployment settings, and merge decisions. |
| Frontend developer | Work from short-lived branches and open PRs into `main`. |
| Backend developer | Work from short-lived branches and open PRs into `main` when backend work is added. |

AI-generated branches must go through the same pull request and review process as human-authored branches.

## Daily Development Flow

Start from the latest production branch:

```bash
git switch main
git pull origin main
```

Create a focused work branch:

```bash
git switch -c feature/login-page
git switch -c feature/auth-api
git switch -c fix/chart-rendering
git switch -c chore/project-config
git switch -c docs/api-notes
git switch -c ai/codex-scaffold-router
```

Commit and push:

```bash
git add .
git commit -m "feat: add login page"
git push -u origin feature/login-page
```

Open a pull request into `main`.

## Pull Request Rules

- PR target is `main`.
- Keep each PR focused on one feature, fix, or setup task.
- Include testing notes, screenshots, or Vercel Preview links when relevant.
- At least one human review is required before merge.
- AI-generated changes require human review before merge.

## Vercel Deployment Flow

Vercel should be connected to this GitHub repository with these settings:

- Production Branch: `main`
- Build Command: `npm run build`
- Output Directory: `dist`

Every Pull Request should create a Preview Deployment. Merging into `main` should create the Production Deployment.

## Recommended GitHub Branch Protection

For `main`:

- Require pull request before merging.
- Require at least 1 approval.
- Require status checks once CI or Vercel checks are enabled.
- Restrict direct pushes.
- Include administrators if the team wants strict release control.
