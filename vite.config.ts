import importMetaUrlPlugin from '@codingame/esbuild-import-meta-url-plugin';
import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    target: 'es2022',
    rollupOptions: {
      output: {
        // The order of chunks is important
        manualChunks: {
          react: ['react', 'react-dom', 'react-router'],
          langium: ['langium', 'langium-cli', 'langium-railroad'],
          jschardet: ['jschardet'],
          'vscode-lsp': ['vscode-languageserver-protocol', 'vscode-ws-jsonrpc'],
          'monaco-vscode-base-service-override': ['@codingame/monaco-vscode-base-service-override'],
          'monaco-vscode-configuration-service-override': ['@codingame/monaco-vscode-configuration-service-override'],
          'monaco-vscode-api': ['@codingame/monaco-vscode-api', '@codingame/monaco-vscode-editor-api'],
          'monaco-vscode-extension-api': ['@codingame/monaco-vscode-extension-api'],
          'vscode-languageclient': ['vscode-languageclient'],
          'monaco-editor-wrapper': ['monaco-editor-wrapper'],
        },
      },
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      plugins: [importMetaUrlPlugin],
    },
  },
  worker: {
    format: 'es',
  },
});
