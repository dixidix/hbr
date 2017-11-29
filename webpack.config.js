var path = require("path"),
  webpack = require("webpack"),
  CopyWebpackPlugin = require("copy-webpack-plugin"),
  BrowserSyncPlugin = require("browser-sync-webpack-plugin"),
  ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
  entry: {
    app: "./app/app.js",

    vendor: [
      "./node_modules/angular/angular.js",
      "./node_modules/angular-ui-router/release/angular-ui-router.min.js",
      "./node_modules/angular-ui-bootstrap/dist/ui-bootstrap.js",
      "./node_modules/angular-animate/angular-animate.min.js",
      "./node_modules/angular-sanitize/angular-sanitize.min.js",
      "./node_modules/angular-ui-bootstrap/dist/ui-bootstrap-tpls.js",
      "./bower_components/angular-ui-switch/angular-ui-switch.min.js"
    ]
  },

  output: {
    path: path.join(__dirname, "dist"),
    filename: "[name].bundle.min.js",
    libraryTarget: "umd"
  },

  devServer: {
    port: 5000
  },

  externals: {
    // require("jquery") is external and available
    // on the global var jQuery
    jquery: "jQuery",
    angular: "angular"
  },
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract(["css-loader"])
      },
      {
        test: /\.(sass|scss)$/,
        loader: ExtractTextPlugin.extract(["css-loader", "sass-loader"])
      }
    ]
  },
  plugins: [
    new BrowserSyncPlugin({
      // browse to http://localhost:3000/ during development,
      // ./public directory is being served
      host: "localhost",
      port: 4200,
      proxy: "localhost/hbr-selfie"
    }),
    new ExtractTextPlugin({
      // define where to save the file
      filename: "[name].css",
      allChunks: true
    }),
    new CopyWebpackPlugin([
      {
        context: "app/",
        from: "*",
        to: path.join(__dirname, "dist"),
        force: true,
        ignore: ["*.txt", "*.scss"]
      },
      {
        context: "app/",
        from: "**/*",
        to: path.join(__dirname, "dist"),
        force: true,
        ignore: ["*.txt", "*.scss"]
      },
      {
        context: "app/",
        from: "**/**/*",
        to: path.join(__dirname, "dist"),
        force: true,
        ignore: ["*.txt", "*.scss"]
      },
      {
        context: "app/",
        from: "**/**/**/*",
        to: path.join(__dirname, "dist"),
        force: true,
        ignore: ["*.txt", "*.scss"]
      }
    ])
  ]
};
