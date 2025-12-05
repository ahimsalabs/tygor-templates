import { useState, useEffect, useCallback, FormEvent } from "react";
import { createClient, ServerError, ValidationError } from "@tygor/client";
import { registry } from "./rpc/manifest";
import { schemaMap } from "./rpc/schemas.map.zod";
import type { Task } from "./rpc/types";
import { useAtom } from "./useAtom";
import "./App.css";

const client = createClient(registry, {
  baseUrl: "/api",
  schemas: schemaMap,
  validate: { request: true },
});

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

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Subscribe to version changes - refetch when version bumps
  const version = useAtom(client.Tasks.Version);

  const fetchTasks = useCallback(async () => {
    try {
      const result = await client.Tasks.List({});
      setTasks(result);
    } catch (err) {
      setError(formatError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Refetch when version changes
  useEffect(() => {
    if (version.data?.value !== undefined) {
      fetchTasks();
    }
  }, [version.data?.value, fetchTasks]);

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    const t = title.trim();
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

      <div className={`status ${version.isConnected ? "connected" : "connecting"}`}>
        {version.isConnected ? "●" : version.isConnecting ? "○" : "◌"} {version.status}
      </div>

      <form onSubmit={handleCreate}>
        <div className="form-group">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What needs to be done?"
          />
          <button type="submit">Add</button>
        </div>
      </form>

      {error && <div className="error">{error}</div>}

      {loading && <p className="hint">Loading...</p>}

      <ul className="task-list">
        {tasks.map((task) => (
          <li key={task.id} className="task-item">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => handleToggle(task)}
            />
            <span className={task.completed ? "completed" : ""}>{task.title}</span>
            <button className="delete" onClick={() => handleDelete(task.id)}>×</button>
          </li>
        ))}
      </ul>

      {!loading && tasks.length === 0 && (
        <p className="hint">No tasks yet. Add one above!</p>
      )}

      <p className="hint">
        Open this page in multiple tabs - they all sync via the LiveValue!
      </p>
    </div>
  );
}
