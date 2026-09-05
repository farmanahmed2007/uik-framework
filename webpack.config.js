const path = require('path');
const CompressionPlugin = require('compression-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const RemoveEmptyScriptsPlugin = require('webpack-remove-empty-scripts');

const currentDirectory = path.resolve(__dirname);

/**
 * Assets are authored under src/lib/ but emitted at the root of src/dist/, so
 * `src/lib/img/flags/4x3/ad.svg` becomes `img/flags/4x3/ad.svg`. The stylesheet
 * sits one level down in src/dist/css/, hence the `../` public path.
 */
const assetGenerator = {
  filename: (pathData) => pathData.filename.replace('src/lib/', ''),
  publicPath: '../'
};

module.exports = {
  mode: 'production',

  entry: {
    'uik-framework-scss': [path.resolve(currentDirectory, 'src/lib/sass/uik.scss')],
    'uik': [path.resolve(currentDirectory, 'src/lib/js/uik.js')]
  },

  output: {
    path: path.join(currentDirectory, 'src/dist'),
    filename: 'js/[name].bundle.min.js',
    // Replaces clean-webpack-plugin, which is unmaintained and deleted the
    // output directory at plugin-construction time rather than at build time.
    clean: true
  },

  module: {
    rules: [
      {
        test: /\.s(a|c)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              url: {
                // css-loader 1 left root-absolute URLs alone; css-loader 7
                // tries to resolve them against the filesystem. Keep the old
                // behaviour: `url(/...)` is a server path, not a bundled asset,
                // and is emitted verbatim.
                filter: (url) => !url.startsWith('/')
              }
            }
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: false,
              implementation: require('sass')
            }
          }
        ]
      },
      {
        test: /\.(png|jpe?g|gif|ico)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        type: 'asset/resource',
        generator: assetGenerator
      },
      {
        // The SVG webfont is emitted untouched: it is a font, not an icon, and
        // svgo's parser rejects it.
        test: /\.svg$/,
        include: path.resolve(currentDirectory, 'src/lib/fonts'),
        type: 'asset/resource',
        generator: assetGenerator
      },
      {
        test: /\.svg$/,
        exclude: path.resolve(currentDirectory, 'src/lib/fonts'),
        type: 'asset/resource',
        generator: assetGenerator,
        use: [
          {
            loader: 'svgo-loader',
            options: {
              // svgo 2+ replaced the flat plugin list with preset-default plus
              // overrides. These are the same three settings the svgo 1 config
              // expressed: keep path data untouched, do not shorten hex colours,
              // and drop <title> (already part of preset-default).
              plugins: [
                {
                  name: 'preset-default',
                  params: {
                    overrides: {
                      convertPathData: false,
                      convertColors: { shorthex: false }
                    }
                  }
                }
              ]
            }
          }
        ]
      },
      {
        test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
        type: 'asset/resource',
        generator: assetGenerator
      },
      {
        test: /\.(wav|mpg|mpeg|mp3)(\?v=\d+\.\d+\.\d+)?$/,
        type: 'asset/resource',
        generator: { filename: 'audio/[name][ext]' }
      }
    ]
  },

  resolve: {
    extensions: ['.js', '.css', '.scss']
  },

  plugins: [
    new WebpackManifestPlugin({
      fileName: path.resolve(currentDirectory, 'src/dist/manifest.json'),
      publicPath: ''
    }),
    new MiniCssExtractPlugin({
      filename: 'css/uik.bundle.min.css'
    }),
    // The SCSS entry would otherwise emit an empty companion JS chunk.
    new RemoveEmptyScriptsPlugin(),
    new CompressionPlugin({
      algorithm: 'gzip',
      test: /\.(js|css|ttf|eot|svg|gif)(\?v=\d+\.\d+\.\d+)?$/,
      minRatio: 0.8
    })
  ],

  optimization: {
    minimizer: [
      new TerserPlugin({ extractComments: false }),
      new CssMinimizerPlugin({
        minimizerOptions: {
          preset: ['default', { discardComments: { removeAll: true } }]
        }
      })
    ]
  },

  performance: {
    // The stylesheet is legitimately large; see README "Known limitations".
    hints: false
  }
};
