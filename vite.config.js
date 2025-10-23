import {defineConfig} from 'vite';
import {hydrogen} from '@shopify/hydrogen/vite';
import {oxygen} from '@shopify/mini-oxygen/vite';
import {reactRouter} from '@react-router/dev/vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [hydrogen(), oxygen(), reactRouter(), tsconfigPaths()],

  build: {
    assetsInlineLimit: 0,
  },

  optimizeDeps: {
    include: ['three'],
    exclude: ['algoliasearch'],
  },

  resolve: {
    alias: {
      // Force browser builds
      algoliasearch: 'algoliasearch/dist/builds/browser.js',
      '@algolia/client-search': '@algolia/client-search/dist/builds/browser.js',
      '@algolia/requester-node-http': '@algolia/requester-fetch',
    },
    conditions: ['worker', 'browser', 'module', 'import', 'default'],
    mainFields: ['browser', 'module', 'main'],
  },

  ssr: {
    optimizeDeps: {
      include: [
        'set-cookie-parser',
        'cookie',
        'react-router',
        '@sanity/client',
        '@sanity/image-url',
        'rxjs',
      ],
    },
    noExternal: ['three', /^@sanity/, /^rxjs/, /^algoliasearch/, /^@algolia/],
    external: [
      'http',
      'https',
      'url',
      'stream',
      'zlib',
      'fs',
      'path',
      'crypto',
      'buffer',
    ],
  },

  server: {
    allowedHosts: ['.tryhydrogen.dev'],
  },
});
