import { Plugin } from 'vite';
import Handlebars from 'handlebars';
import {
  createPartialMap,
  decideTemplateFileExtension,
  transform,
} from './internal';

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
  const partialMap = createPartialMap(
    templateFileExtension,
    options.partialsDirectoryPath
  );
  return {
    name: '@yoichiro/vite-plugin-handlebars',
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
