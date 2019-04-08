const md = require('markdown-it')()
  .use(require('markdown-it-mark'))
md.options.html = true
md.renderer.rules.link_open = function (tokens, idx, options, env, self) {
  const token = tokens[idx]
  const href = token.attrs[token.attrIndex('href')][1]
  if (href.startsWith('/')) {
    return `<router-link to="${href}">`
  } else {
    return `<a href="${href}" target="_blank">`
  }
}
md.renderer.rules.link_close = function (tokens, idx, options, env, self) {
  const token = tokens[idx - 2]
  const href = token.attrs[token.attrIndex('href')][1]
  if (href.startsWith('/')) {
    return `</router-link>`
  } else {
    return `</a>`
  }
}

module.exports = {
  pluginOptions: {
    quasar: {
      treeShake: true
    }
  },
  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.md$/,
          loader: 'ware-loader',
          enforce: 'pre',
          options: {
            raw: true,
            middleware: function (source) {
              return `<template><div>${md.render(source)}</div></template>`
            }
          }
        },
        {
          test: /\.md$/,
          use: 'vue-loader'
        }
      ]
    }
  },
  transpileDependencies: [
    /[\\\/]node_modules[\\\/]quasar[\\\/]/
  ],
  pwa: {
    workboxOptions: {
      skipWaiting: true,
      clientsClaim: true
    }
  }
}
