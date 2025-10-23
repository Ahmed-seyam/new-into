import {defineConfig} from 'vite';
import {hydrogen} from '@shopify/hydrogen/vite';
import {oxygen} from '@shopify/mini-oxygen/vite';
import {reactRouter} from '@react-router/dev/vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'path';

export default defineConfig({
  plugins: [hydrogen(), oxygen(), reactRouter(), tsconfigPaths()],

  build: {
    assetsInlineLimit: 0,
  },

  optimizeDeps: {
    include: [
      'three',
      'use-sync-external-store/shim/with-selector',
      
    ],
  },
  resolve: {
    alias: {
      '~': path.resolve(__dirname, 'app'), // or your project root
    },
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
        'algoliasearch-helper',
        'instantsearch.js',
        'react-instantsearch',
        'react-instantsearch-core',
        'react-card-flip',
        "react-social-media-embed",
        "@headlessui/react",
        "@sanity/block-content-to-react",
        'algoliasearch/lite'
      ],
    },
    noExternal: [
      'three',
      /^@sanity/,
      /^rxjs/,
      'instantsearch.js',
      /^react-instantsearch/,
      '@headlessui/react',
      /^react-card/,
      /^react-social/,
      /^headlessui/,
      "react-social-media-embed",
    ],
  },

  server: {
    allowedHosts: ['.tryhydrogen.dev'],
  },
});
