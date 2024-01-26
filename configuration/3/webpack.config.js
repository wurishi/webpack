module.exports = function (env, argv) {
  env = env || {};

  // argv['optimize-minimize'] === true 只有传入 -p 或 --optimize-minimize

  return {
    mode: env.production ? 'production' : 'development',
    devtool: env.production ? 'source-maps' : 'eval',
    entry: './index.js',
  };
};
