# Claude Code Demo Reel

Interactive demo showcasing how to effectively direct Claude Code for professional software development.

## Quick Start

```bash
npm install
npm run dev
```

## Build for Production

```bash
npm run build
```

Static files output to `dist/`.

## Deploy to GitHub Pages

Push to `main` branch - GitHub Actions automatically builds and deploys.

Live at: `https://YOUR_USERNAME.github.io/claude-code-demo/`

## What This Demonstrates

- **Director/Executor model**: You direct, Claude executes
- **Parallel workers**: One sentence → 5 simultaneous implementation streams
- **Epic decomposition**: Paste requirements → get atomic issues with dependencies
- **Architecture pivots**: Request impact analysis before major changes
- **Quality patterns**: Stacked PRs, CI auditing, E2E infrastructure

## Tech Stack

- Vite + React + TypeScript
- Tailwind CSS
- Framer Motion
