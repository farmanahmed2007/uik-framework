const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CompressionPlugin = require("compression-webpack-plugin");
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const ManifestPlugin = require('webpack-manifest-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const FixStyleOnlyEntriesPlugin = require("webpack-fix-style-only-entries");
const resolve = require('path').resolve;

const currentDirectory = path.resolve(__dirname);


module.exports = env => {

  return {
    mode: 'production',
    watch: true,
    //devtool: 'eval-cheap-module-source-map',
    // size maintained
    //devtool: 'eval-cheap-module-source-map',
    //size decreases by 80%
    // devtool: 'source-map',

    entry: {
      "uik-framework": [
        path.resolve(currentDirectory + '/src/lib/js/uik.js'),
        path.resolve(currentDirectory + '/src/lib/sass/uik.scss'),
      ],
    },

    output: {
      path: path.join(currentDirectory + '/src/dist/'),
      filename: 'js/uik.bundle.min.js'
    },

    module: {
      // loaders: [
      //   {
      //     test: /\.js$/,
      //     loader: 'babel-loader',
      //     exclude: [/node_modules/],
      //     query: {
      //       presets: ['es2015'],
      //       plugins: ["transform-object-assign", "transform-runtime"]
      //     }
      //   }
      // ],
      rules: [{
        enforce: "pre",
        test: /\.s(a|c)ss$/,
        loader: 'import-glob-loader'
      },
      {
        test: /\.module\.s(a|c)ss$/,
        loader: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: true,
              localIdentName: '[name]__[local]___[hash:base64:5]',
              camelCase: true,
              sourceMap: false
            }
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: false
            }
          },
        ]
      },
      {
        test: /\.s(a|c)ss$/,
        exclude: /\.module.(s(a|c)ss)$/,
        loader: [
          MiniCssExtractPlugin.loader,

          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              sourceMap: false,
              // outputPath : path.join(currentDirectory + '/src/dist/[name]/js/')

            }
          }

        ]
      },
      {
        test: /\.(png|jpg|gif|ico|jpeg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: {
          loader: 'file-loader', // this need file-loader
          options: {
            //limit: 50000
            name: '[path][name].[ext]',
            outputPath: function (url) {
              // console.log(url);
              // let temp = url.replace('src/lib/','').split('/');
              // let ProjectName = temp[0];
              // console.log(ProjectName)
              return url.replace('src/lib/', '');
            },
            publicPath: function (url) {
              let temp = url.replace('src/lib/', '').split('/');
              let ProjectName = temp[0];
              // console.log(ProjectName)
              // return url.replace('src/lib/' + ProjectName, '../');
              return url.replace('src/lib/', '../');
            }
          }
        }
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              //limit: 50000
              name: '[path][name].[ext]',
              outputPath: function (url) {
                // console.log(url);
                // let temp = url.replace('src/lib/','').split('/');
                // let ProjectName = temp[0];
                // console.log(ProjectName)
                return url.replace('src/lib/', '');
              },
              publicPath: function (url) {
                let temp = url.replace('src/lib/', '').split('/');
                let ProjectName = temp[0];
                // console.log(ProjectName)
                // return url.replace('src/lib/' + ProjectName, '../');
                return url.replace('src/lib/', '../');
              }
            }
          },
          {
            loader: 'svgo-loader',
            options: {
              plugins: [
                { removeTitle: true },
                { convertColors: { shorthex: false } },
                { convertPathData: false }
              ]
            }
          }
        ]
      },
      {
        test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: '[path][name].[ext]',
            outputPath: function (url) {
              // console.log(url);
              // let temp = url.replace('src/lib/','').split('/');
              // let ProjectName = temp[0];
              // console.log(ProjectName)
              return url.replace('src/lib/', '');
            },
            publicPath: function (url) {
              let temp = url.replace('src/lib/', '').split('/');
              let ProjectName = temp[0];
              // console.log(ProjectName)
              // return url.replace('src/lib/' + ProjectName, '../');
              return url.replace('src/lib/', '../');
            }
          }
        }]
      },
      {
        test: /\.(wav|mpg|mpeg|mp3)(\?v=\d+\.\d+\.\d+)?$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: '/audio/',
            // publicPath: function(url) {
            //     return '/lib/audio/' + url;
            // }
          }
        }]
      }
      ]
    },

    resolve: {
      extensions: ['.webpack.js', '.web.js', '.ts', '.js', '.css', '.scss']
    },

    plugins: [
      new CleanWebpackPlugin(['src/dist']),
      new ManifestPlugin({
        fileName: path.resolve(currentDirectory + '/src/dist/manifest.json'),
        publicPath: '',

      }),
      new MiniCssExtractPlugin({
        filename: "css/uik.bundle.min.css",
      }),
      new OptimizeCssAssetsPlugin({
        cssProcessorPluginOptions: {
          preset: ['default', { discardComments: { removeAll: true } }],
        },
      }),

      new FixStyleOnlyEntriesPlugin(),
      // new CopyWebpackPlugin([
      // ]),
      new CompressionPlugin({
        algorithm: 'gzip',
        test: /\.(js|css|ttf|eot|svg|gif)(\?v=\d+\.\d+\.\d+)?$/,
        minRatio: 0.8
      })
    ],

    //If .map files required, comment the following
    optimization: {
      minimizer: [
        new UglifyJsPlugin({
          cache: true,
          parallel: true,
          sourceMap: false // set to true if you want JS source maps
        }),
        new OptimizeCssAssetsPlugin({
          assetNameRegExp: /\.css$/,
          cssProcessor: require('cssnano'),
          cssProcessorPluginOptions: {
            preset: ['default', { discardComments: { removeAll: true } }],
          },
          canPrint: true
        })
      ]
    }
  }

}