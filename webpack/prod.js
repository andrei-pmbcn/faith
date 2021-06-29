const { merge } = require("webpack-merge");
const path = require("path");
const base = require("./base.js");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = merge(base, {
  mode: 'production',
  output: {
    filename: 'faith-[contenthash].min.js'
  },
  devtool: false,
  performance: {
    maxEntrypointSize: 900000,
    maxAssetSize: 900000
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          output: {
            comments: false
          }
        }
      })
    ]
  }
});
