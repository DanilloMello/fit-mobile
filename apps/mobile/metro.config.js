const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

// Tell expo-router exactly where the app routes live.
// Without this, withNxMetro corrupting projectRoot causes route discovery to fail.
process.env.EXPO_ROUTER_APP_ROOT = path.join(projectRoot, 'src/app');

// SDK 52+ expo/metro-config handles monorepo detection automatically.
// We do NOT use withNxMetro — it overwrites projectRoot and breaks expo-router's
// route discovery in this NX + Expo SDK 54 + Windows combination.
const config = getDefaultConfig(projectRoot);

// Monorepo: watch all workspace libs and resolve node_modules from both roots
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

// Build @connecthealth/* module aliases directly from tsconfig paths so Metro
// can resolve monorepo libs without relying on withNxMetro's broken path mapping.
const tsconfigPaths = require('./tsconfig.json').compilerOptions.paths;
const connectHealthAliases = {};
for (const [alias, targets] of Object.entries(tsconfigPaths)) {
  // targets[0] is relative to tsconfig baseUrl ("../..") = workspaceRoot
  connectHealthAliases[alias] = path.resolve(workspaceRoot, targets[0]);
}

// Resolve a module relative to a specific root, bypassing Metro's walk-up logic.
const resolveFrom = (mod) =>
  require.resolve(mod, { paths: [path.resolve(workspaceRoot, 'node_modules')] });

// Intercept module resolution for expo-router entry and @connecthealth/* libs
const originalResolveRequest = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  // Force a single copy of React across all packages in the monorepo.
  // extraNodeModules is only a fallback (skipped when the module is found
  // locally), so we must intercept here. Zustand lives in workspaceRoot and
  // resolves react@19.2.x; the renderer links against apps/mobile react@19.1.x —
  // two instances → "Invalid hook call". Pin every react sub-path to one copy.
  if (
    moduleName === 'react' ||
    moduleName === 'react/jsx-runtime' ||
    moduleName === 'react/jsx-dev-runtime' ||
    moduleName === 'react/compiler-runtime'
  ) {
    return { type: 'sourceFile', filePath: resolveFrom(moduleName) };
  }

  // When a dev-client APK (or Expo Go) requests the classic Expo entry or the
  // expo-router entry as a relative path, pin it to the installed package file.
  if (
    moduleName === 'expo-router/entry' ||
    moduleName.endsWith('/node_modules/expo-router/entry') ||
    moduleName.endsWith('\\node_modules\\expo-router\\entry')
  ) {
    return {
      type: 'sourceFile',
      filePath: require.resolve('expo-router/entry'),
    };
  }
  // Resolve @connecthealth/* monorepo lib aliases
  if (connectHealthAliases[moduleName]) {
    return {
      type: 'sourceFile',
      filePath: connectHealthAliases[moduleName],
    };
  }
  if (typeof originalResolveRequest === 'function') {
    return originalResolveRequest(context, moduleName, platform);
  }
  return context.resolveRequest(context, moduleName, platform);
};

// When a dev-client APK (or Expo Go) requests the classic Expo entry bundle URL,
// rewrite it to expo-router/entry before Metro starts bundling.
config.server = {
  ...config.server,
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

module.exports = config;
