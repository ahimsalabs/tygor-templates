import { createSignal, createEffect, on, For, Show, createResource } from "solid-js";
import { createClient, ServerError, ValidationError } from "@tygor/client";
import { registry } from "./rpc/manifest";
import { schemaMap } from "./rpc/schemas.map.zod";
import type { Task } from "./rpc/types";
import { useLiveValue } from "./useAtom";
import "./App.css";

const client = createClient(registry, {
  baseUrl: "/api",
  schemas: schemaMap,
  validate: { request: true },
});

export default function App() {
  const [tasks, { refetch }] = createResource(() => client.Tasks.List({}));
  const [title, setTitle] = createSignal("");
  const [error, setError] = createSignal<string | null>(null);

  // Subscribe to version changes - refetch when version bumps
  const version = useLiveValue(client.Tasks.Version);
  createEffect(
    on(
      () => version().data?.value,
      () => refetch(),
      { defer: true }
    )
  );

  const handleCreate = async (e: Event) => {
    e.preventDefault();
    setError(null);
    const t = title().trim();
    if (!t) return;
    try {
      await client.Tasks.Create({ title: t });
      setTitle("");
    } catch (err) {
      setError(formatError(err));
    }
  };

  const handleToggle = async (task: Task) => {
    try {
      await client.Tasks.Toggle({ id: task.id });
    } catch (err) {
      setError(formatError(err));
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await client.Tasks.Delete({ id });
    } catch (err) {
      setError(formatError(err));
    }
  };

  return (
    <div>
      <h1>Tygor Tasks</h1>

      <div class={`status ${version().isConnected ? "connected" : "connecting"}`}>
        {version().isConnected ? "●" : version().isConnecting ? "○" : "◌"} {version().status}
      </div>

      <form onSubmit={handleCreate}>
        <div class="form-group">
          <input
            value={title()}
            onInput={(e) => setTitle(e.currentTarget.value)}
            placeholder="What needs to be done?"
          />
          <button type="submit">Add</button>
        </div>
      </form>

      <Show when={error()}>
        <div class="error">{error()}</div>
      </Show>

      <Show when={tasks.loading && !tasks.latest}>
        <p class="hint">Loading...</p>
      </Show>

      <ul class="task-list">
        <For each={tasks.latest}>
          {(task) => (
            <li class="task-item">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => handleToggle(task)}
              />
              <span class={task.completed ? "completed" : ""}>{task.title}</span>
              <button class="delete" onClick={() => handleDelete(task.id)}>×</button>
            </li>
          )}
        </For>
      </ul>

      <Show when={tasks.latest?.length === 0}>
        <p class="hint">No tasks yet. Add one above!</p>
      </Show>

      <p class="hint">
        Open this page in multiple tabs - they all sync via the LiveValue!
      </p>
    </div>
  );
}

function formatError(err: unknown): string {
  if (err instanceof ValidationError) {
    const messages = err.issues.map((issue) => {
      const path = issue.path?.join(".") ?? "";
      return path ? `${path}: ${issue.message}` : issue.message;
    });
    return messages.join("; ");
  }
  if (err instanceof ServerError) {
    return err.message;
  }
  return err instanceof Error ? err.message : "Unknown error";
}
