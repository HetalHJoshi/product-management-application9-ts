import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  base: "/", // Use "/" if deployed at domain root. Otherwise, set to your subdirectory (e.g., "/my-app/")
  resolve: {
    alias: {
      // This alias tells Vite that any import of "bootstrap-esm"
      // should be resolved to the Bootstrap ESM file.
      "bootstrap-esm": path.resolve(
        __dirname,
        "node_modules/bootstrap/dist/js/bootstrap.esm.js"
      ),
    },
  },
});
