module.exports = {
  pluginOptions: {
    i18n: {
      enableInSFC: true
    },
    webpackBundleAnalyzer: {
      openAnalyzer: false
    }
  },
  css: {
    loaderOptions: {
      // pass options to sass-loader
      sass: {
        // @/ is an alias to src/
        // so this assumes you have a file named `src/variables.scss`
        data: `@import "@/styles/_variables.scss";`
      }
    }
  },
  devServer: {
    https: false
  }
}
