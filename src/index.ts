import { Plugin } from 'vite';
import {
  decideTemplateFileExtension,
  handleHotUpdate,
  transform,
} from './internal.js';

/** This plugin supports a variety of options to customize the behavior of the Handlebars compiler. */
export type CompileOptions = {
  /** Set to false to disable `@data` tracking. */
  data?: boolean;
  /** Set to true to enable recursive field lookup. */
  compat?: boolean;
  /**
   * Hash containing list of helpers that are known to exist (truthy) at template execution time.
   * Passing this allows the compiler to optimize a number of cases.
   * Builtin helpers are automatically included in this list and may be omitted by setting that value to `false`.
   * */
  knownHelpers?: { [p: string]: boolean };
  /** Set to true to allow further optimizations based on the known helpers list. */
  knownHelpersOnly?: boolean;
  /** Set to true to not HTML escape any content. */
  noEscape?: boolean;
  /**
   * Run in strict mode. In this mode, templates will throw rather than silently ignore missing fields.
   * This has the side effect of disabling inverse operations such as `{{^foo}}{{/foo}}`
   * unless fields are explicitly included in the source object.
   * */
  strict?: boolean;
  /**
   * Removes object existence checks when traversing paths.
   * This is a subset of `strict` mode that generates optimized templates when the data inputs are known to be safe.
   * */
  assumeObjects?: boolean;
  /**
   * By default, an indented partial-call causes the output of the whole partial being indented by the same amount.
   * This can lead to unexpected behavior when the partial writes `pre` -tags.
   * Setting this option to `true` will disable the auto-indent feature.
   */
  preventIndent?: boolean;
  /**
   * Disables standalone tag removal when set to `true`.
   * When set, blocks and partials that are on their own line will not remove the whitespace on that line.
   * */
  ignoreStandalone?: boolean;
  /**
   * Disables implicit context for partials.
   * When enabled, partials that are not passed a context value will execute against an empty object.
   */
  explicitPartialContext?: boolean;
};

/** The options for the Handlebars plugin. */
export type HandlebarsPluginOptions = {
  /** The file extension of the Handlebars template files. Default is '.hbs'. */
  templateFileExtension?: string;
  /**
   * The directory path where partial Handlebars files are stored.
   * If this option is set, the plugin automatically loads and compiles all partial Handlebars files.
   * If omitted, the plugin does not load and compile partial Handlebars files.
   */
  partialsDirectoryPath?: string;
  /**
   * Set to true to optimize the partial registration.
   * This option is effective only when `partialsDirectoryPath` is set.
   * If omitted, the plugin does not optimize the partial registration.
   * If true, the plugin does not register the partials that are already registered.
   */
  optimizePartialRegistration?: boolean;
  /** The compile options for the Handlebars compiler. */
  compileOptions?: CompileOptions;
};

/**
 * The Handlebars plugin for Vite.
 * @param options The options for the Handlebars plugin.
 * @returns The Vite plugin instance.
 */
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
        options.partialsDirectoryPath,
        options.compileOptions,
        options.optimizePartialRegistration
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
