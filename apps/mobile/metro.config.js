const { getDefaultConfig } = require('expo/metro-config');
const { withNxMetro } = require('@nx/expo');
const path = require('path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// Ensure NX workspace packages are resolved
config.watchFolders = [workspaceRoot];
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

module.exports = withNxMetro(config, {
  debug: false,
  extensions: [],
  watchFolders: [],
});
