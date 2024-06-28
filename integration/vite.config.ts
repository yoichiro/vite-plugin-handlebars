import { defineConfig } from 'vite';
import handlebarsImportPlugin from '../dist/index';
import { resolve } from 'path';

export default defineConfig({
  root: 'integration',
  plugins: [
    handlebarsImportPlugin({
      templateFileExtension: '.handlebars',
      partialsDirectoryPath: resolve(__dirname, 'partials'),
    }),
  ],
});
