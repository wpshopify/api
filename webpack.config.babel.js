import webpack from 'webpack'
import path from 'path'
import ProgressBarPlugin from 'progress-bar-webpack-plugin'

const config = {
   mode: 'production',
   externals: ['lodash', 'react', 'react-dom'],
   entry: {
      index: './index'
   },
   output: {
      filename: '[name].js',
      path: path.resolve(__dirname, 'dist'),
      jsonpFunction: 'wpshopifyApi',
      library: 'wpshopifyApi',
      libraryTarget: 'umd'
   },
   resolve: {
      extensions: ['.js', '.jsx']
   },
   plugins: [new ProgressBarPlugin()],
   module: {
      rules: [
         {
            test: /\.(js|jsx)$/i,
            exclude: /(node_modules)/,
            enforce: 'pre',
            use: [
               {
                  loader: 'babel-loader',
                  options: {
                     babelrcRoots: ['.'],
                     presets: ['@babel/preset-env', '@babel/preset-react']
                  }
               }
            ]
         }
      ]
   }
}

export default config
