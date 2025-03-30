import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  // If your site is deployed at the root (e.g. https://yoursite.com/), use base: '/'
  // If it's in a subdirectory (e.g. https://yoursite.com/myapp/), use base: '/myapp/'
  base: "/",
  resolve: {
    alias: {
      "bootstrap-esm": path.resolve(
        __dirname,
        "node_modules/bootstrap/dist/js/bootstrap.esm.js"
      ),
    },
  },
});
