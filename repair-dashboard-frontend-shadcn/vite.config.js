import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    historyApiFallback: true, // For dev server
  },
  build: {
    rollupOptions: {
      // Code splitting configuration
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          // Split your pages into separate chunks
          tickets: ['./src/pages/TicketsPage', './src/pages/TicketDetail'],
        }
      }
    }
  }
})
