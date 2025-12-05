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
| `starter-solid` | Solid.js + Vite todo list with LiveValue invalidation |
| `starter-react` | React + Vite todo list with LiveValue invalidation |
| `starter-sqlc` | Solid.js + Vite + sqlc (SQLite database) |

## What's Included

Each template includes:

- **Go backend** with example handlers
- **Frontend** with type-safe API client
- **Hot reload** via `@tygor/vite-plugin`
- **Zod validation** for runtime type checking

## Developing with Local Tygor

To use a local checkout of tygor instead of the published version:

1. Add a replace directive to `go.mod`:
   ```
   replace tygor.dev => ../path/to/tygor
   ```

2. Set the tygor command in `vite.config.js` (wrapped in shell for env var):
   ```js
   tygor({
     tygorCommand: ["sh", "-c", "GOFLAGS=-mod=mod go run ../path/to/tygor/cmd/tygor \"$@\"", "--"],
     // ...
   })
   ```

3. Run `go mod tidy` to update dependencies:
   ```bash
   go mod tidy
   ```
