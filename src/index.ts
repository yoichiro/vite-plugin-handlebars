import { Plugin } from 'vite';
import Handlebars from 'handlebars';
import {
  createPartialMap,
  decideTemplateFileExtension,
  transform,
} from './internal';

export type HandlebarsImportPluginOptions = {
  templateFileExtension?: string;
  partialsDirectoryPath?: string;
};

export default function handlebarsImportPlugin(
  options: HandlebarsImportPluginOptions = {}
): Plugin {
  const templateFileExtension = decideTemplateFileExtension(
    options.templateFileExtension
  );
  const partialMap = createPartialMap(
    templateFileExtension,
    options.partialsDirectoryPath
  );
  return {
    name: 'vite-plugin-handlebars-import',
    transform(code, id) {
      if (!id.endsWith(templateFileExtension)) {
        return null;
      }
      const precompiled = Handlebars.precompile(code);
      const transformed = transform(code, id, partialMap);
      return {
        code: transformed,
        map: null,
      };
    },
  };
}
