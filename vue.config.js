module.exports = {
  productionSourceMap: false,

  devServer: {
    host: 'localhost',
    port: 1812,
    https: true,
    pfx: 'server/certs/localhost.pfx',
  },

  pwa: {
    name: 'knop',
    themeColor: '#E56A05',

    // configure workbox
    workboxPluginMode: 'GenerateSW',
    workboxOptions: {
      importWorkboxFrom: 'local',
      skipWaiting: false,
      runtimeCaching: [
        {
          urlPattern: /api\/knop/,
          method: 'POST',
          handler: 'networkOnly',
          options: {
            backgroundSync: {
              name: 'knop-queue',
              options: {
                maxRetentionTime: 30 * 24 * 60 * 60,
              },
            },
          },
        },
        {
          urlPattern: /api\/drukjes/,
          method: 'POST',
          handler: 'networkOnly',
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
