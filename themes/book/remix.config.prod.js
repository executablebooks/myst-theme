/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  appDirectory: 'app',
  assetsBuildDirectory: 'public/build',
  serverBuildPath: 'build/index.js',
  serverMinify: true,
  publicPath: '/build/',
  ignoredRouteFiles: ['**/.*'],
  serverDependenciesToBundle: [/.*/],
  future: {
    v2_routeConvention: true,
    v2_normalizeFormMethod: true,
  },
};
