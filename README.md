# Tygor Templates

Project templates for [tygor](https://github.com/ahimsalabs/tygor) - type-safe HTTP for Go + TypeScript.

**Requirements:** Go 1.23+, Bun (or npm/pnpm)

## Quick Start

```bash
# Solid.js (recommended)
bunx degit ahimsalabs/tygor-templates/starter-solid my-app

# React
bunx degit ahimsalabs/tygor-templates/starter-react my-app

# With sqlc (database)
bunx degit ahimsalabs/tygor-templates/starter-sqlc my-app

# Then
cd my-app
bun install
bun dev
```

## Available Templates

| Template | Description |
|----------|-------------|
| `starter-solid` | Solid.js + Vite with Atoms + Streams |
| `starter-react` | React + Vite with Query/Exec/Stream |
| `starter-sqlc` | Solid.js + Vite + sqlc (SQLite database) |

## What's Included

Each template includes:

- **Go backend** with example handlers
- **Frontend** with type-safe API client
- **Hot reload** via `@tygor/vite-plugin`
- **Zod validation** for runtime type checking
