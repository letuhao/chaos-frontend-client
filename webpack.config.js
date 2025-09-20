const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';
  
  return {
    entry: {
      'game-ui': './web-assets/src/js/game-ui.ts',
      'unity-bridge': './web-assets/src/js/unity-bridge.ts',
      'steam-integration': './web-assets/src/js/steam-integration.ts'
    },
    
    output: {
      path: path.resolve(__dirname, 'builds/webgl'),
      filename: isProduction ? 'static/js/[name].[contenthash].js' : 'static/js/[name].js',
      clean: true,
      publicPath: '/'
    },
    
    module: {
      rules: [
        {
          test: /\.ts$/,
          exclude: /node_modules/,
          use: {
            loader: 'ts-loader',
            options: {
              transpileOnly: true
            }
          }
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            }
          }
        },
        {
          test: /\.css$/,
          use: [
            isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
            'css-loader'
          ]
        },
        {
          test: /\.(png|jpg|jpeg|gif|svg)$/,
          type: 'asset/resource',
          generator: {
            filename: 'static/images/[name].[contenthash][ext]'
          }
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/,
          type: 'asset/resource',
          generator: {
            filename: 'static/fonts/[name].[contenthash][ext]'
          }
        },
        {
          test: /\.(mp3|wav|ogg)$/,
          type: 'asset/resource',
          generator: {
            filename: 'static/sounds/[name].[contenthash][ext]'
          }
        }
      ]
    },
    
    plugins: [
      new CleanWebpackPlugin(),
      
      new HtmlWebpackPlugin({
        template: './web-assets/src/html/welcome.html',
        filename: 'index.html',
        chunks: ['game-ui', 'unity-bridge', 'steam-integration'],
        minify: isProduction ? {
          removeComments: true,
          collapseWhitespace: true,
          removeRedundantAttributes: true,
          useShortDoctype: true,
          removeEmptyAttributes: true,
          removeStyleLinkTypeAttributes: true,
          keepClosingSlash: true,
          minifyJS: true,
          minifyCSS: true,
          minifyURLs: true
        } : false
      }),
      
      ...(isProduction ? [
        new MiniCssExtractPlugin({
          filename: 'static/css/[name].[contenthash].css'
        })
      ] : [])
    ],
    
    devServer: {
      compress: true,
      port: 3200,
      hot: true,
      open: true,
      historyApiFallback: {
        index: '/index.html'
      },
      devMiddleware: {
        writeToDisk: true,
        publicPath: '/'
      },
      static: {
        directory: path.join(__dirname, 'builds/webgl'),
        publicPath: '/',
        serveIndex: true,
        watch: true
      },
      headers: {
        'Cross-Origin-Embedder-Policy': 'require-corp',
        'Cross-Origin-Opener-Policy': 'same-origin'
      },
      // Debug options
      client: {
        logging: 'verbose',
        overlay: {
          errors: true,
          warnings: false,
        },
      },
      onListening: function(devServer) {
        if (!devServer) {
          throw new Error('webpack-dev-server is not defined');
        }
        console.log('🚀 Dev server is running on http://localhost:3200');
        console.log('📁 Serving files from:', path.join(__dirname, 'builds/webgl'));
      }
    },
    
    optimization: {
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all'
          }
        }
      }
    },
    
    resolve: {
      extensions: ['.ts', '.js', '.css'],
      alias: {
        '@': path.resolve(__dirname, 'web-assets/src'),
        '@css': path.resolve(__dirname, 'web-assets/src/css'),
        '@js': path.resolve(__dirname, 'web-assets/src/js'),
        '@assets': path.resolve(__dirname, 'web-assets/src/assets'),
        '@types': path.resolve(__dirname, 'web-assets/src/types')
      }
    }
  };
};