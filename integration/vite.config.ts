import { defineConfig } from 'vite';
import handlebarsPlugin from '../dist/index';
import { resolve } from 'path';

export default defineConfig({
  root: 'integration',
  plugins: [
    handlebarsPlugin({
      templateFileExtension: '.handlebars',
      partialsDirectoryPath: resolve(__dirname, 'partials'),
      optimizePartialRegistration: true,
      transformIndexHtmlOptions: {
        context: async () => {
          return Promise.resolve({ keyword: 'static' });
        },
        helpers: {
          'upper-case': (str: string) => str.toUpperCase(),
        },
      },
    }),
  ],
});
