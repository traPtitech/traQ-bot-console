import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { quasar, transformAssetUrls } from '@quasar/vite-plugin'
import mdPlugin from 'vite-plugin-markdown'
import { VitePWA } from 'vite-plugin-pwa'

const md = require('markdown-it')()
  .use(require('markdown-it-mark'))
md.options.html = true
md.renderer.rules.link_open = function (tokens, idx, options, env, self) {
  const token = tokens[idx]
  const href = token.attrs[token.attrIndex('href')][1]
  if (href.startsWith('/')) {
    return `<router-link to='${href}'>`
  } else {
    return `<a href='${href}' target='_blank'>`
  }
}
md.renderer.rules.link_close = function (tokens, idx, options, env, self) {
  const token = tokens[idx - 2]
  const href = token.attrs[token.attrIndex('href')][1]
  if (href.startsWith('/')) {
    return '</router-link>'
  } else {
    return '</a>'
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: { transformAssetUrls }
    }),
    VitePWA({
      registerType: 'prompt',
      devOptions: {
        enabled: true
      },
      manifest: {
        name: "traQ Bot Console",
        short_name: "traQ Bot Console",
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ],
        start_url: "./index.html",
        theme_color: "#ffffff",
        background_color: "#ffffff",
        display: "standalone"
      }
    }),

    // @quasar/plugin-vite options list:
    // https://github.com/quasarframework/quasar/blob/dev/vite-plugin/index.d.ts
    quasar({}),

    mdPlugin({
      mode: ['html', 'vue'],
      markdownIt: md,
    })
  ],
})
