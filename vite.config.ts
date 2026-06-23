import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/yu-ai-portfolio/",
  plugins: [react()],
});
