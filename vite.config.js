import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Isso aqui é o que resolve o erro do import!
      'react-native': 'react-native-web',
    },
  },
})