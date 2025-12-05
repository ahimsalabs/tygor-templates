# Tygor + sqlc Starter

A Solid.js + Vite + Go starter using tygor for type-safe RPC with sqlc for database access.

## Quick Start

```bash
bunx degit ahimsalabs/tygor-templates/starter-sqlc my-app
cd my-app
bun install
bun dev
```

Open http://localhost:5173

## What's Included

- **Go backend** with sqlc for type-safe SQL
- **SQLite database** (pure Go, no CGO required)
- **Solid.js frontend** with type-safe API calls
- **Type-safe RPC** - Go types generate TypeScript automatically
- **Hot reload** - Edit Go or TypeScript, browser updates

## The Example

This starter demonstrates tygor with sqlc:

**Query** - GET requests, cacheable:
- `Tasks.List` - Lists tasks with pagination
- `Tasks.Get` - Gets a single task by ID
- `Tasks.ListIncomplete` - Lists incomplete tasks

**Exec** - POST requests, mutations:
- `Tasks.Create` - Creates a new task
- `Tasks.Update` - Updates a task
- `Tasks.Delete` - Deletes a task

**Atom** - real-time sync:
- `Tasks.Version` - Version counter, bumped on mutations (for optimistic updates)

## Scripts

- `bun dev` - Start Go + Vite dev servers with hot-reload
- `bun run gen` - Regenerate TypeScript types from Go
- `bun run build` - Production build
- `bun run typecheck` - Type-check TypeScript

## Project Structure

```
.
├── main.go            # Go server with handlers
├── schema.sql         # Database schema
├── queries.sql        # SQL queries for sqlc
├── sqlc.yaml          # sqlc configuration
├── sqlc/              # Generated sqlc code
├── src/
│   ├── rpc/           # Generated TypeScript (don't edit)
│   ├── App.tsx        # Main Solid component
│   └── main.tsx       # Entry point
└── vite.config.js     # Vite + tygor plugin config
```

## How sqlc Works

1. Define your schema in `schema.sql`
2. Write SQL queries in `queries.sql` with `-- name: FuncName :one/:many/:exec` comments
3. Run `sqlc generate` to generate Go code in `sqlc/`
4. Use the generated functions in your tygor handlers

The generated sqlc types are automatically picked up by `tygor gen` for TypeScript generation.
