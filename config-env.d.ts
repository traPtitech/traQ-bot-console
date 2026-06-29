declare module 'markdown-it-mark' {
  import type MarkdownIt from 'markdown-it'

  const markdownItMark: (md: MarkdownIt) => void
  export default markdownItMark
}

declare module 'vuex' {
  import type { App, InjectionKey } from 'vue'

  export interface ActionContext<S, R> {
    commit: (type: string, payload?: unknown) => void
    dispatch: (type: string, payload?: unknown) => Promise<unknown>
    state: S
    getters: Record<string, unknown>
    rootState: R
    rootGetters: Record<string, unknown>
  }

  export interface Store<S> {
    readonly state: S
    readonly getters: Record<string, unknown>
    install: (app: App, injectKey?: InjectionKey<Store<unknown>> | string) => void
    commit: (type: string, payload?: unknown) => void
    dispatch: (type: string, payload?: unknown) => Promise<unknown>
  }

  export function createStore<S> (options: {
    state: S | (() => S)
    getters?: Record<string, (state: S) => unknown>
    mutations?: Record<string, (...args: any[]) => unknown>
    actions?: Record<string, (...args: any[]) => unknown>
    plugins?: Array<(store: Store<S>) => void>
  }): Store<S>

  export function useStore<S = unknown> (injectKey?: InjectionKey<Store<S>> | string): Store<S>
}

declare module 'virtual:pwa-register' {
  export function registerSW (options?: {
    onNeedRefresh?: () => void
  }): () => void
}

declare module '*.md' {
  import type { Component } from 'vue'

  export const VueComponent: Component
}
