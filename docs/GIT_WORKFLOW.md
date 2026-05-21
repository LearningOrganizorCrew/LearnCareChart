# Git Workflow

This repository uses a simple integration-branch workflow for a 3-person MVP team.

## Branch Roles

| Branch | Purpose |
| --- | --- |
| `main` | Stable release branch. Only reviewed, release-ready code is merged here. |
| `develop` | Integration branch for ongoing MVP work. Feature branches merge here first. |
| `feature/fe-*` | Frontend feature work. |
| `feature/be-*` | Backend feature work. |
| `fix/*` | Bug fixes. |
| `chore/*` | Project setup, tooling, configuration, dependency updates. |
| `docs/*` | Documentation-only work. |
| `ai/codex-*` | Branches created with Codex assistance. |
| `ai/claude-*` | Branches created with Claude Code assistance. |

## Team Responsibilities

| Role | Responsibilities |
| --- | --- |
| Project lead | Manage GitHub Issues, Pull Requests, branch rules, releases, and merge decisions. |
| Frontend developer | Work from `feature/fe-*` branches and open PRs into `develop`. |
| Backend developer | Work from `feature/be-*` branches and open PRs into `develop`. |

AI-generated branches must go through the same pull request and review process as human-authored branches.

## Daily Development Flow

Start from the latest integration branch:

```bash
git switch develop
git pull origin develop
```

Create a focused work branch:

```bash
git switch -c feature/fe-login-page
git switch -c feature/be-auth-api
git switch -c fix/chart-rendering
git switch -c chore/project-config
git switch -c docs/api-notes
git switch -c ai/codex-scaffold-router
```

Commit and push:

```bash
git add .
git commit -m "feat: add login page"
git push -u origin feature/fe-login-page
```

Open a pull request into `develop`.

## Pull Request Rules

- PR target should usually be `develop`.
- PRs into `main` are only for stable release promotion.
- Keep each PR focused on one feature, fix, or setup task.
- Include testing notes, screenshots, or API examples when relevant.
- At least one human review is required before merge.
- AI-generated changes require human review before merge.

## Release Flow

When `develop` is stable:

```bash
git switch main
git pull origin main
git merge --no-ff develop
git tag v0.1.0
git push origin main --tags
```

Use semantic versioning once releases begin:

- `v0.1.0`: first MVP release
- `v0.1.1`: patch release
- `v0.2.0`: next MVP feature milestone

## Recommended GitHub Branch Protection

For `main`:

- Require pull request before merging.
- Require at least 1 approval.
- Require status checks once CI exists.
- Restrict direct pushes.
- Include administrators if the team wants strict release control.

For `develop`:

- Require pull request before merging.
- Require at least 1 approval.
- Require status checks once CI exists.
- Allow project lead to resolve urgent integration issues if needed.
