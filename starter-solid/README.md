# Tygor + Solid.js Starter

A minimal Solid.js + Vite + Go starter using tygor for type-safe RPC with real-time sync.

## Quick Start

```bash
bunx degit ahimsalabs/tygor-templates/starter-solid my-app
cd my-app
bun install
bun dev
```

Open http://localhost:5173

## What's Included

- **Go backend** with an Atom (real-time synced state) and a Set method
- **Solid.js frontend** with reactive subscriptions
- **Type-safe RPC** - Go types generate TypeScript automatically
- **Hot reload** - Edit Go or TypeScript, browser updates
- **Validation** - Server validates message length (5-10 chars)

## The Example

This starter demonstrates tygor's real-time features:

**Atom** - server-side state that syncs to all connected clients:
- `Message.State` - Broadcasts the current message and set count
- `Message.Set` - Updates the message (validates 5-10 character length)

**Stream** - push-based server-sent events:
- `Time.Now` - Streams the current server time every second

Open the app in multiple tabs - they all stay in sync!

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
├── main.go            # Go server with Atom + handlers
├── types.go           # Go types (generate TypeScript from these)
├── src/
│   ├── rpc/           # Generated TypeScript (don't edit)
│   ├── App.tsx        # Main Solid component
│   └── main.tsx       # Entry point
└── vite.config.js     # Vite + tygor plugin config
```

## Adding New Endpoints

1. Define types in `types.go`
2. Add handler in `main.go`
3. Register with:
   - `tygor.Query(Handler)` - GET requests, cacheable
   - `tygor.Exec(Handler)` - POST requests, mutations
   - `tygor.Stream(Handler)` - Server-sent events
   - `atom.Handler()` - Real-time synced state
4. Types regenerate automatically on save
5. Use in frontend: `client.Service.Method({ ... })`
