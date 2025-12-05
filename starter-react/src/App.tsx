import { useState, FormEvent } from "react";
import { createClient, ServerError, ValidationError } from "@tygor/client";
import { registry } from "./rpc/manifest";
import { schemaMap } from "./rpc/schemas.map.zod";
import { useAtom } from "./useAtom";

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
  const atom = useAtom(client.Message.State);
  const time = useAtom(client.Time.Now({}));
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSet = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await client.Message.Set({ message: input });
      setInput("");
    } catch (err) {
      setError(formatError(err));
    }
  };

  return (
    <div>
      <h1>Message Atom</h1>

      <div style={{ fontSize: "0.75rem", color: atom.isConnected ? "#16a34a" : "#ca8a04", marginBottom: "1rem" }}>
        {atom.isConnected ? "●" : atom.isConnecting ? "○" : "◌"} {atom.status}
      </div>

      {atom.data && (
        <div style={{ marginBottom: "1rem" }}>
          <div style={{ fontSize: "2rem", fontWeight: "bold" }}>{atom.data.message}</div>
          <div style={{ fontSize: "0.875rem", color: "#666" }}>
            Set {atom.data.set_count} time{atom.data.set_count !== 1 ? "s" : ""}
          </div>
        </div>
      )}

      <form onSubmit={handleSet}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="5-10 characters..."
          minLength={5}
          maxLength={10}
        />
        <button type="submit">Set</button>
      </form>

      {error && (
        <div style={{ color: "#dc2626", marginTop: "0.5rem", fontSize: "0.875rem" }}>
          {error}
        </div>
      )}

      <p style={{ fontSize: "0.75rem", color: "#999", marginTop: "2rem" }}>
        Open this page in multiple tabs - they all sync via the Atom!
      </p>

      {time.data && (
        <div style={{ marginTop: "2rem", fontSize: "0.875rem", color: "#666" }}>
          Server time: {new Date(time.data.time).toLocaleTimeString()}
        </div>
      )}
    </div>
  );
}
