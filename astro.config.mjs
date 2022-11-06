/// <reference types="vitest" />
import { defineConfig } from 'astro/config'

// https://astro.build/config
import image from '@astrojs/image'
import netlify from '@astrojs/netlify/functions'

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: netlify(),
  integrations: [
    image({
      serviceEntryPoint: '@astrojs/image/sharp',
    }),
  ],
  vite: {
    test: {
      environment: 'jsdom',
    },
  },
})
