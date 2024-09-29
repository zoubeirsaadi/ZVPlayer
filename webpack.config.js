import path from 'path';
import { fileURLToPath } from 'url';
import ESLintWebpackPlugin from 'eslint-webpack-plugin';

// Pour remplacer __dirname dans un module ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  entry: './src/zv-player-sdk.js',
  output: {
    filename: 'zv-player-sdk.bundle.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'ZVPlayer',
    libraryTarget: 'umd', // Universal Module Definition (UMD) pour la compatibilité
    libraryExport: 'default', // Export de la valeur par défaut de votre module
    globalObject: 'this', // Permet d'éviter des erreurs dans certains environnements Node
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader', // Assurez-vous que Babel transpile le code pour des versions plus anciennes si nécessaire
        },
      },
    ],
  },
  plugins: [
    new ESLintWebpackPlugin({
      extensions: ['js'],
      fix: true,
    }),
  ],
  mode: 'production', // Utilisez production pour la version minifiée
};
