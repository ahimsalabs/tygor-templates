import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { tygor } from "@tygor/vite-plugin";
// import basicSsl from "@vitejs/plugin-basic-ssl";

export default defineConfig({
  plugins: [
    // Uncomment for HTTPS (recommended for testing auth, cookies, etc.):
    // basicSsl(),
    react(),
    tygor({
      proxyPrefix: "/api",
      build: "go build -o ./.tygor/server .",
      buildOutput: "./.tygor/server",
      start: (port) => ({
        cmd: ["./.tygor/server"],
        env: { PORT: String(port) },
      }),
      rpcDir: "./src/rpc",
    }),
  ],
});
