import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { quasar, transformAssetUrls } from '@quasar/vite-plugin'
import { Mode, plugin as mdPlugin } from 'vite-plugin-markdown'
import MarkdownIt from 'markdown-it'
import markdownItMark from 'markdown-it-mark'

const md = MarkdownIt()
  .use(markdownItMark)
md.options.html = true
md.renderer.rules['link_open'] = function (tokens, idx) {
  const token = tokens[idx]
  const hrefIndex = token?.attrIndex('href') ?? -1
  const href = hrefIndex >= 0 ? token?.attrs?.[hrefIndex]?.[1] : undefined
  if (href?.startsWith('/')) {
    return `<router-link to='${href}'>`
  } else {
    return `<a href='${href}' target='_blank'>`
  }
}
md.renderer.rules['link_close'] = function (tokens, idx) {
  const token = tokens[idx - 2]
  const hrefIndex = token?.attrIndex('href') ?? -1
  const href = hrefIndex >= 0 ? token?.attrs?.[hrefIndex]?.[1] : undefined
  if (href?.startsWith('/')) {
    return '</router-link>'
  } else {
    return '</a>'
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: { transformAssetUrls }
    }),

    // @quasar/plugin-vite options list:
    // https://github.com/quasarframework/quasar/blob/dev/vite-plugin/index.d.ts
    quasar({}),

    mdPlugin({
      mode: [Mode.HTML, Mode.VUE],
      markdownIt: md,
    })
  ],
})
