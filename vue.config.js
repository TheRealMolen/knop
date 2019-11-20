module.exports = {
  productionSourceMap: false,

  devServer: {
    host: 'localhost',
    port: 1812,
    https: true,
  },

  pwa: {
    name: 'knop',
    themeColor: '#E56A05',

    // configure workbox
    workboxPluginMode: 'GenerateSW',
    workboxOptions: {
      skipWaiting: false,
      runtimeCaching: [
        {
          urlPattern: /api\/knop/,
          method: 'POST',
          handler: 'networkFirst',
          options: {
            backgroundSync: {
              name: 'druk-queue',
              options: {
                maxRetentionTime: 30 * 24 * 60 * 60,
              },
            },
          },
        },
        {
          urlPattern: /api\/drukjes/,
          method: 'POST',
          handler: 'networkFirst',
          options: {
            backgroundSync: {
              name: 'druk-queue',
              options: {
                maxRetentionTime: 30 * 24 * 60 * 60,
              },
            },
          },
        },
        {
          urlPattern: /api\//,
          handler: 'networkFirst',
        },
      ],
    },
  },
};
