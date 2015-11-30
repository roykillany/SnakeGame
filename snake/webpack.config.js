module.exports = {
  context: __dirname,
  entry: "./js/main.js",
  output: {
    path: "./js",
    filename: "bundle.js",
    devtoolModuleFilenameTemplate: '[resourcePath]',
    devtoolFallbackModuleFilenameTemplate: '[resourcePath]?[hash]'
  }
};
