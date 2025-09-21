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
    
    
    devServer: {
      compress: true,
      port: 3200,
      hot: true,
      open: true,
      historyApiFallback: {
        index: '/index.html',
        disableDotRule: true
      },
      devMiddleware: {
        publicPath: '/',
        writeToDisk: true,
        index: 'index.html'
      },
      static: false,
      setupMiddlewares: (middlewares, devServer) => {
        if (!devServer) {
          throw new Error('webpack-dev-server is not defined');
        }
        // Avoid Chrome DevTools probing path causing noisy 404s
        devServer.app.get('/.well-known/appspecific/com.chrome.devtools.json', (req, res) => {
          res.setHeader('Content-Type', 'application/json');
          res.status(200).send(JSON.stringify({ ok: true }));
        });
        return middlewares;
      },
      headers: {
        'Cross-Origin-Embedder-Policy': 'require-corp',
        'Cross-Origin-Opener-Policy': 'same-origin',
        // Relaxed CSP for development to allow HMR and local requests
        'Content-Security-Policy': [
          "default-src 'self'",
          "connect-src 'self' http://localhost:3200 ws://localhost:3200",
          "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
          "style-src 'self' 'unsafe-inline'",
          "img-src 'self' data: blob:",
          "font-src 'self' data:",
          "worker-src 'self' blob:",
          "media-src 'self' blob:",
          "frame-ancestors 'self'"
        ].join('; ')
      },
      client: {
        logging: 'info',
        overlay: {
          errors: true,
          warnings: false,
        },
      },
      onListening: function(devServer) {
        const addr = devServer.server.address();
        console.log(`🚀 Dev server listening on http://localhost:${addr.port}`);
        console.log('📄 History API fallback to /index.html (from webpack output)');
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
      },
      fallback: {
        "process": require.resolve("process/browser")
      }
    },
    
    plugins: [
      new CleanWebpackPlugin(),
      
      // Define process for browser
      new (require('webpack')).DefinePlugin({
        'process.env': JSON.stringify(process.env)
      }),
      
      new HtmlWebpackPlugin({
        template: './web-assets/src/html/welcome.html',
        filename: 'index.html',
        inject: 'body',
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
  };
};