declare module 'markdown-it-mark' {
  import type MarkdownIt from 'markdown-it'

  const markdownItMark: (md: MarkdownIt) => void
  export default markdownItMark
}

declare module '*.md' {
  import type { Component } from 'vue'

  export const VueComponent: Component
}
