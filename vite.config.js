import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// vite.config.js
export default {
  server: {
    headers: {
      "Cross-Origin-Opener-Policy": "same-origin",
      "Cross-Origin-Embedder-Policy": "require-corp",
    },
  },
};
