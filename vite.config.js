import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// NOTE: `base` is set to './' so the built site works from any path.
// This makes it drop-in compatible with a GitHub Pages user site
// (https://Timmy-Churchill.github.io/). We'll revisit in the deploy phase.
export default defineConfig({
  base: './',
  plugins: [react()],
  // Force a single copy of three across drei / fiber / postprocessing.
  // Without this, postprocessing can load a second three instance and
  // EffectComposer's cross-instance checks fail ("Multiple instances of
  // Three.js being imported").
  resolve: {
    dedupe: ['three', '@react-three/fiber'],
  },
  build: {
    // Split the heavy 3D libraries into their own cacheable chunks so the app
    // code stays small and repeat visits load faster.
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three'],
          r3f: [
            '@react-three/fiber',
            '@react-three/drei',
            '@react-three/postprocessing',
          ],
        },
      },
    },
    chunkSizeWarningLimit: 900,
  },
})
