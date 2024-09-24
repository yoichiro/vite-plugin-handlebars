import path from 'path';
import Handlebars from 'handlebars';
import fs from 'fs';
import { ViteDevServer } from 'vite';

let cachePartialMap: { [p: string]: string } | undefined = undefined;

export const decideTemplateFileExtension = (
  templateFileExtension?: string
): string => {
  return templateFileExtension === undefined
    ? '.hbs'
    : templateFileExtension.startsWith('.')
      ? templateFileExtension
      : `.${templateFileExtension}`;
};

export const createPartialMap = (
  templateFileExtension: string,
  partialsDirectoryPath: string | undefined,
  compileOptions: CompileOptions | undefined
): { [p: string]: TemplateSpecification } => {
  if (partialsDirectoryPath === undefined) {
    return {};
  }
  const partialsPath = path.resolve(partialsDirectoryPath);
  const partialsFiles = getAllHandlebarsFiles(
    templateFileExtension,
    partialsPath
  );
  return loadAndCompileFiles(
    templateFileExtension,
    partialsPath,
    partialsFiles,
    compileOptions
  );
};

const getPartialMap = (
  templateFileExtension: string,
  partialsDirectoryPath: string | undefined,
  compileOptions: CompileOptions | undefined
): { [p: string]: TemplateSpecification } => {
  return (
    cachePartialMap ??
    createPartialMap(
      templateFileExtension,
      partialsDirectoryPath,
      compileOptions
    )
  );
};

const resetPartialMap = (): void => {
  cachePartialMap = undefined;
};

export const transform = (
  code: string,
  _id: string,
  templateFileExtension: string,
  partialsDirectoryPath: string | undefined,
  compileOptions: CompileOptions | undefined,
  optimizePartialRegistration: boolean | undefined
): string => {
  const partialMap = getPartialMap(
    templateFileExtension,
    partialsDirectoryPath,
    compileOptions
  );
  const precompiled = Handlebars.precompile(code, compileOptions ?? {});
  return `
import Handlebars from 'handlebars/runtime';

${Object.entries(partialMap)
  .map(([name, content]) =>
    optimizePartialRegistration
      ? `if (Handlebars.partials['${name}'] === undefined) {
  Handlebars.registerPartial('${name}', Handlebars.template(${content.toString()}));
}`
      : `Handlebars.registerPartial('${name}', Handlebars.template(${content.toString()}));`
  )
  .join('\n')}
export default Handlebars.template(${precompiled.toString()});`;
};

export const loadAndCompileFile = (
  filePath: string,
  compileOptions: CompileOptions | undefined
): TemplateSpecification => {
  return Handlebars.precompile(
    fs.readFileSync(filePath, 'utf-8'),
    compileOptions ?? {}
  );
};

export const loadAndCompileFiles = (
  templateFileExtension: string,
  baseDirectoryPath: string,
  filePaths: string[],
  compileOptions: CompileOptions | undefined
): { [p: string]: TemplateSpecification } => {
  return filePaths.reduce(
    (partialMap, file: string) => {
      const partialName = convertFilePathToPartialName(
        templateFileExtension,
        baseDirectoryPath,
        file
      );
      partialMap[partialName] = loadAndCompileFile(file, compileOptions);
      return partialMap;
    },
    {} as { [p: string]: TemplateSpecification }
  );
};

export const convertFilePathToPartialName = (
  templateFileExtension: string,
  baseDirectoryPath: string,
  filePath: string
): string => {
  return path
    .relative(baseDirectoryPath, filePath)
    .replace(/\\/g, '/')
    .replace(templateFileExtension, '');
};

export const getAllHandlebarsFiles = (
  templateFileExtension: string,
  directoryPath: string,
  arrayOfFiles: string[] = []
): string[] => {
  const files = fs.readdirSync(directoryPath);
  arrayOfFiles = arrayOfFiles || [];
  files.forEach((file) => {
    const filePath = path.join(directoryPath, file);
    if (fs.statSync(filePath).isDirectory()) {
      arrayOfFiles = getAllHandlebarsFiles(
        templateFileExtension,
        filePath,
        arrayOfFiles
      );
    } else if (file.endsWith(templateFileExtension)) {
      arrayOfFiles.push(filePath);
    }
  });
  return arrayOfFiles.sort();
};

export const handleHotUpdate = (file: string, server: ViteDevServer): void => {
  resetPartialMap();
  server.moduleGraph.invalidateAll();
  server.ws.send({
    type: 'full-reload',
    path: '*',
  });
};
