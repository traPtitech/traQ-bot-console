module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  plugins: [
    [
      'transform-imports',
      {
        quasar: {
          transform: require('quasar/dist/babel-transforms/imports.js'),
          preventFullImport: true
        }
      }
    ]
  ]
}
