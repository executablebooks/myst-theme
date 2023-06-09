/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  publicPath: '/myst_assets_folder/',
  serverBuildPath: 'api/index.js',
  serverMainFields: ['main', 'module'],
  serverModuleFormat: 'cjs',
  serverPlatform: 'node',
  serverMinify: false,
  // When running locally in development mode, we use the built in remix
  // server. This does not understand the vercel lambda module format,
  // so we default back to the standard build output.
  server: process.env.NODE_ENV === 'development' ? undefined : './server.js',
  ignoredRouteFiles: ['**/.*'],
  serverDependenciesToBundle: [
    /^rehype.*/,
    /^remark.*/,
    /^unified.*/,
    /^unist.*/,
    /^hast.*/,
    /^mdast.*/,
    /^micromark.*/,
    'html-whitespace-sensitive-tag-names',
    'html-void-elements',
    'property-information',
    'array-iterate',
    'stringify-entities',
    'comma-separated-tokens',
    'trim-trailing-lines',
    'escape-string-regexp',
    'ccount',
    'web-namespaces',
    'space-separated-tokens',
    'character-entities-legacy',
    'character-entities-html4',
    'trim-lines',
    'bail',
    'is-plain-obj',
    'trough',
    'zwitch',
    'nanoid',
    /^vfile.*/,
    /^myst-.*/,
    'markdown-it-myst',
    'simple-validators',
    'doi-utils',
    'orcid',
    'credit-roles',
    'jats-tags',
    '@myst-theme/providers',
    '@myst-theme/icons',
    '@myst-theme/site',
    '@myst-theme/jupyter',
    '@myst-theme/frontmatter',
    'react-syntax-highlighter',
    '@jupyterlab/rendermime',
    '@jupyterlab/rendermime-interfaces',
  ],
  watchPaths: ['../../packages/**/*'],
  future: {
    v2_routeConvention: true,
    v2_normalizeFormMethod: true,
    v2_headers: true,
  },
};
