/* */
const path = require('path')
const { i18n } = require('../../next-i18next.config')

const nextConfig = {
  i18n,
  distDir: process.cwd() + '/.next',
  api: {
    externalResolver: true,
  },
  experimental: {
    externalDir: true,
  },
  serverRuntimeConfig: {
  },
  publicRuntimeConfig: {
    BUILD_VERSION: process.env.BUILD_VERSION || 'dev',
    SMTP_HOST: process.env.SMTP_HOST
  },
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    /**
     * Plugins
     */
    /**
     * next.js doesn't know alias, so extends webpack config
     * {@link https://webpack.js.org/configuration/resolve}
     */
    config.resolve.alias['~'] = path.join(__dirname)
    config.resolve.alias['@'] = path.join(__dirname, '../')

    /**
     * Modules
     */
    config.module.rules.push(
      /**
       * for import graphql files
       * {@link https://github.com/apollographql/graphql-tag}
       */
      {
        test: /\.svg$/,
        use: ['@svgr/webpack']
      }
    )

    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env.IS_SERVER': isServer
      })
    )

    config.resolve.fallback = {
      fs: false,
      os: false,
      http: false,
      https: false,
      net: false,
      tls: false,
      zlib: false
    }

    return config
  },

  webpackDevMiddleware: (config) => {
    return config
  }
}

module.exports = nextConfig
