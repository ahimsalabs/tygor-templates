# Tygor + React Starter

A minimal React + Vite + Go starter using tygor for type-safe RPC.

## Quick Start

```bash
bunx degit ahimsalabs/tygor-templates/starter-react my-app
cd my-app
bun install
bun dev
```

Open http://localhost:5173

## What's Included

- **Go backend** with Query and Exec handlers
- **React frontend** with type-safe API calls
- **Type-safe RPC** - Go types generate TypeScript automatically
- **Hot reload** - Edit Go or TypeScript, browser updates

## Scripts

- `bun dev` - Start Go + Vite dev servers with hot-reload
- `bun run gen` - Regenerate TypeScript types from Go
- `bun run build` - Production build
- `bun run typecheck` - Type-check TypeScript

## How It Works

The `@tygor/vite-plugin` handles the dev workflow:

1. Watches Go files for changes
2. Runs type generation (`tygor gen`)
3. Builds and restarts Go server (blue-green deployment)
4. Vite HMR picks up TypeScript changes

## Project Structure

```
.
├── main.go            # Go server with handlers
├── api/
│   └── types.go       # Go types (generate TypeScript from these)
├── src/
│   ├── rpc/           # Generated TypeScript (don't edit)
│   ├── App.tsx        # Main React component
│   └── main.tsx       # Entry point
└── vite.config.js     # Vite + tygor plugin config
```

## Adding New Endpoints

1. Define types in `api/types.go`
2. Add handler in `main.go`
3. Register with:
   - `tygor.Query(Handler)` - GET requests, cacheable
   - `tygor.Exec(Handler)` - POST requests, mutations
   - `tygor.Stream(Handler)` - Server-sent events
4. Types regenerate automatically on save
5. Use in frontend: `client.Service.Method({ ... })`
