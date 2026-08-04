import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    // Split vendor libraries into their own chunks. Without this everything
    // lands in one ~1.3MB bundle, which hurts LCP - and Core Web Vitals is a
    // Google ranking signal. Separate chunks also stay cached across deploys
    // when only app code changes.
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return;
          if (/[\\/]node_modules[\\/](react|react-dom|scheduler|react-router|react-router-dom)[\\/]/.test(id)) {
            return 'vendor-react';
          }
          if (id.includes('recharts') || id.includes('d3-') || id.includes('victory')) {
            return 'vendor-charts';
          }
          if (id.includes('framer-motion') || id.includes('motion-dom') || id.includes('motion-utils')) {
            return 'vendor-motion';
          }
          // NOTE: react-player is deliberately NOT manually chunked. Forcing it
          // into a named chunk makes Rollup treat it as a shared dependency of
          // the entry, so it gets modulepreloaded on every page. Left alone, it
          // stays inside the lazy CoursePlayer chunk where it belongs.
          if (id.includes('lucide-react')) return 'vendor-icons';
          if (id.includes('xlsx') || id.includes('jspdf') || id.includes('docx')) {
            return 'vendor-export';
          }
          // Everything else: no manual chunk. Rollup then places a dependency
          // with whichever chunk actually uses it, so libraries needed only by a
          // lazy route are not pulled into the first paint.
          return undefined;
        },
      },
    },
    chunkSizeWarningLimit: 700,
  },
});
