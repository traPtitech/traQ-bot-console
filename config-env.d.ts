declare module 'eslint-plugin-vue' {
  const plugin: any
  export default plugin
}

declare module 'markdown-it-mark' {
  import type MarkdownIt from 'markdown-it'

  const markdownItMark: (md: MarkdownIt) => void
  export default markdownItMark
}
