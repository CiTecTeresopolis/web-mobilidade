import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: './', // Essencial para a subpasta da prefeitura

  plugins: [react()],
  resolve: {
    alias: {
      "react-native": "react-native-web",
    },
  },
  build: {
    outDir: "dist",
    
  },
});
