import {defineConfig} from 'vite';
import hydrogen from '@shopify/hydrogen/plugin';

export default defineConfig({
  plugins: [hydrogen()],
  ssr: {
    external: ['react-card-flip'],
  },
  // optimizeDeps: {
  //   include: [],
  // },
});
