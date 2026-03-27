const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

// @nx/expo lives in the workspace root node_modules (devDep of the monorepo).
// On EAS native builds metro.config.js is not executed, so it is safe to
// fall back to a no-op when the module cannot be resolved.
let withNxMetro;
try {
  withNxMetro = require(
    require.resolve('@nx/expo', {
      paths: [path.resolve(__dirname, '../../node_modules')],
    })
  ).withNxMetro;
} catch {
  withNxMetro = (cfg) => cfg;
}

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

config.watchFolders = [workspaceRoot];
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

config.resolver.resolverMainFields = ['react-native', 'browser', 'main'];

// axios 1.7+ includes a react-native condition in its exports map, so Metro
// now correctly resolves the browser-safe bundle. Re-enable package exports.
// The _zlib-shim.js remains as a safety fallback for any other package
// that may import zlib constants.
config.resolver.unstable_enablePackageExports = true;

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
  assert: require.resolve('assert'),
  // constants-only zlib shim — browserify-zlib crashes on RN 0.76 New Arch;
  // axios reads Z_SYNC_FLUSH at module load time but never compresses on RN
  zlib: path.resolve(__dirname, '_zlib-shim.js'),
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

const nxConfig = withNxMetro(config, {
  debug: false,
  extensions: ['ts', 'tsx', 'js', 'jsx'],
  watchFolders: [workspaceRoot],
});

// When a dev-client APK (or Expo Go) requests the classic Expo entry
// (node_modules/expo/AppEntry.bundle), rewrite the URL to expo-router/entry
// before Metro starts bundling. This happens when the Metro manifest cache
// is stale or the executor reads the workspace-root package.json (no "main" field).
nxConfig.server = {
  ...nxConfig.server,
  rewriteRequestUrl: (url) => {
    if (url.includes('node_modules/expo/AppEntry')) {
      return url.replace(
        /node_modules\/expo\/AppEntry/g,
        'node_modules/expo-router/entry'
      );
    }
    return url;
  },
};

// Expo Router 6 requests the entry as a relative path
// (./node_modules/expo-router/entry). withNxMetro overwrites resolveRequest,
// so we wrap it AFTER to intercept the entry before the NX resolver sees it.
const nxResolveRequest = nxConfig.resolver.resolveRequest;
nxConfig.resolver.resolveRequest = (context, moduleName, platform) => {
  if (
    moduleName === 'expo-router/entry' ||
    moduleName.endsWith('/node_modules/expo-router/entry') ||
    // Also catch backslash variants on Windows
    moduleName.endsWith('\\node_modules\\expo-router\\entry')
  ) {
    return {
      type: 'sourceFile',
      filePath: require.resolve('expo-router/entry'),
    };
  }
  if (typeof nxResolveRequest === 'function') {
    return nxResolveRequest(context, moduleName, platform);
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = nxConfig;
