import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { configDefaults } from 'vitest/config';

export default defineConfig(async ({ mode }) => {
  const plugins = [vue()];

  // On charge les DevTools SEULEMENT si on n'est pas en test
  if (mode !== 'test') {
    const { default: vueDevTools } = await import('vite-plugin-vue-devtools');
    plugins.push(vueDevTools());
  }

  return {
    plugins: plugins,
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      host: '0.0.0.0',
      port: 80,
    },
    test: {
      globals: true,
      environment: 'jsdom',
      exclude: [...configDefaults.exclude, 'e2e/**'],
    },
  };
});