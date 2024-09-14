import { Plugin } from 'vite';
import {
  decideTemplateFileExtension,
  handleHotUpdate,
  transform,
} from './internal.js';

export type HandlebarsPluginOptions = {
  templateFileExtension?: string;
  partialsDirectoryPath?: string;
};

export default function handlebarsPlugin(
  options: HandlebarsPluginOptions = {}
): Plugin {
  const templateFileExtension = decideTemplateFileExtension(
    options.templateFileExtension
  );
  return {
    name: '@yoichiro/vite-plugin-handlebars',
    transform(code, id) {
      if (!id.endsWith(templateFileExtension)) {
        return null;
      }
      const transformed = transform(
        code,
        id,
        templateFileExtension,
        options.partialsDirectoryPath
      );
      return {
        code: transformed,
        map: null,
      };
    },
    handleHotUpdate({ file, server }) {
      if (options.partialsDirectoryPath === undefined) {
        return;
      }
      if (!file.startsWith(options.partialsDirectoryPath)) {
        return;
      }
      handleHotUpdate(file, server);
    },
  };
}
