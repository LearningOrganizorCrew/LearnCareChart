# LearnCare Chart MVP

교육청 공공데이터 활용대회 제출용 LearnCare Chart 목업입니다.

## Local Preview

```bash
npm run dev
```

## Build

```bash
npm run build
```

The build creates a static `dist/` directory for Vercel.

## Deployment

Connect this GitHub repository to Vercel and set the production branch to `main`.

- Pull Requests create Vercel Preview Deployments.
- Merging into `main` creates the Vercel Production Deployment.
- Build command: `npm run build`
- Output directory: `dist`

## GitHub Flow

1. Create a short-lived branch from `main`.
2. Commit focused changes.
3. Open a Pull Request into `main`.
4. Confirm the Vercel Preview Deployment.
5. Merge into `main` to deploy production.

See [docs/GIT_WORKFLOW.md](docs/GIT_WORKFLOW.md) for the full workflow.
