const { getDefaultConfig } = require('expo/metro-config');
const { withNxMetro } = require('@nx/expo');
const path = require('path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

config.watchFolders = [workspaceRoot];
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

config.resolver.resolverMainFields = ['react-native', 'browser', 'main'];

// Shim every Node built-in that cannot run on Hermes/React Native
const emptyModule = path.resolve(__dirname, '_empty-module.js');
config.resolver.extraNodeModules = {
  // real polyfills
  crypto: require.resolve('expo-crypto'),
  url: require.resolve('react-native-url-polyfill'),
  stream: require.resolve('stream-browserify'),
  buffer: require.resolve('buffer'),
  http: require.resolve('stream-http'),
  https: require.resolve('https-browserify'),
  os: require.resolve('os-browserify/browser'),
  path: require.resolve('path-browserify'),
  zlib: require.resolve('browserify-zlib'),
  assert: require.resolve('assert'),
  // empty shims — never called at runtime in React Native
  fs: emptyModule,
  net: emptyModule,
  tls: emptyModule,
  http2: emptyModule,
  child_process: emptyModule,
  dgram: emptyModule,
  dns: emptyModule,
  async_hooks: emptyModule,
  perf_hooks: emptyModule,
  readline: emptyModule,
  repl: emptyModule,
  vm: emptyModule,
  worker_threads: emptyModule,
  cluster: emptyModule,
  module: emptyModule,
  v8: emptyModule,
  inspector: emptyModule,
  string_decoder: emptyModule,
  querystring: emptyModule,
  events: emptyModule,
  punycode: emptyModule,
};

module.exports = withNxMetro(config, {
  debug: false,
  extensions: ['ts', 'tsx', 'js', 'jsx'],
  watchFolders: [workspaceRoot],
});
