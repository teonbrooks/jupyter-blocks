import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    react(),
    dts({ insertTypesEntry: true })
  ],
  build: {
    outDir: 'lib',
    lib: {
      entry: 'src/index.ts',
      formats: ['es', 'cjs'],
      fileName: format => `index.${format === 'es' ? 'mjs' : 'cjs'}`
    },
    sourcemap: true,
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        'blockly',
        /^@jupyterlab\//,
        /^@lumino\//,
        /^@blockly\//
      ]
    }
  }
});
