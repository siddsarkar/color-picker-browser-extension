const path = require('path')
const sync = require('glob').sync
const CopyPlugin = require('copy-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const common = {
  entry: {
    /* generate service_worker entry */
    sw: `${__dirname}/source/sw.ts`,

    /* generate entries for all views from `source/views` directory */
    ...Object.fromEntries(
      sync('source/views/**/*.ts').map(v => [
        /(?<=source\/).+(?=[$.])/.exec(v)[0],
        `./${v}`
      ])
    )
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  output: {
    clean: true,
    filename: '[name].js',
    path: path.resolve(__dirname, 'addon')
  },
  plugins: [
    /* copy entire public folder */
    new CopyPlugin({ patterns: ['public'] })
  ]
}

const dev = {
  ...common,
  stats: 'minimal',
  name: 'dev',
  mode: 'development',
  devtool: 'inline-source-map',
  module: {
    rules: [
      ...common.module.rules,
      {
        // use tailwindcss with postcss
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1 // 1 => postcss-loader
            }
          },
          'postcss-loader'
        ]
      }
    ]
  },
  plugins: [
    ...common.plugins,

    /* build the html files for all views from `source/views` directory */
    ...sync('source/views/**/*.html').map(
      v =>
        new HtmlWebpackPlugin({
          template: v,
          inject: 'head',
          scriptLoading: 'module',
          filename: /(?<=source\/).+(?=[$.])/.exec(v)[0] + '.html',
          chunks: [/(?<=source\/).+(?=[$.])/.exec(v)[0]]
        })
    )
  ]
}

const prod = {
  ...common,
  name: 'prod',
  mode: 'production',
  devtool: false,
  module: {
    rules: [
      ...common.module.rules,
      {
        // use tailwindcss with postcss
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1 // 1 => postcss-loader
            }
          },
          'postcss-loader'
        ]
      }
    ]
  },
  plugins: [
    ...common.plugins,

    /* build the html files for all views from `source/views` directory */
    ...sync('source/views/**/*.html').map(
      v =>
        new HtmlWebpackPlugin({
          template: v,
          inject: 'head',
          scriptLoading: 'module',
          filename: /(?<=source\/).+(?=[$.])/.exec(v)[0] + '.html',
          chunks: [/(?<=source\/).+(?=[$.])/.exec(v)[0]],
          minify: {
            collapseWhitespace: false,
            removeComments: true
          }
        })
    ),

    /* extract css to a separate file */
    new MiniCssExtractPlugin()
  ],
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          mangle: false,
          compress: {
            defaults: false,
            drop_console: true
          },
          output: {
            comments: false,
            beautify: true,
            indent_level: 2
          }
        }
      })
    ]
  }
}

module.exports = [dev, prod]
