const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Le build ESM de zustand utilise `import.meta`, que le bundle web dev de Metro
// (script classique) ne peut pas parser. On redirige vers le build CommonJS
// (zustand/esm/middleware.mjs → zustand/middleware.js).
const defaultResolveRequest = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  const resolve = defaultResolveRequest ?? context.resolveRequest;
  const resolution = resolve(context, moduleName, platform);
  if (
    resolution?.type === 'sourceFile' &&
    /zustand[\\/]esm[\\/].*\.mjs$/.test(resolution.filePath)
  ) {
    return {
      type: 'sourceFile',
      filePath: resolution.filePath.replace(/([\\/])esm[\\/]/, '$1').replace(/\.mjs$/, '.js'),
    };
  }
  return resolution;
};

module.exports = config;
