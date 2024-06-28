import { describe, expect, test } from 'vitest';
import path from 'path';
import {
  convertFilePathToPartialName,
  createPartialMap,
  decideTemplateFileExtension,
  getAllHandlebarsFiles,
  loadAndCompileFile,
  loadAndCompileFiles,
} from '../src/internal';

describe('getAllHandlebarsFiles', () => {
  test('should return all handlebars files', () => {
    const actual = getAllHandlebarsFiles(
      '.hbs',
      path.resolve(__dirname, 'assets')
    );
    expect(actual.length).toEqual(3);
    expect(actual[0]).toEqual(
      path.resolve(__dirname, 'assets', 'sub', 'test3.hbs')
    );
    expect(actual[1]).toEqual(path.resolve(__dirname, 'assets', 'test 2.hbs'));
    expect(actual[2]).toEqual(path.resolve(__dirname, 'assets', 'test1.hbs'));
  });

  test('should return empty array if no handlebars files found', () => {
    const actual = getAllHandlebarsFiles(
      '.hbs',
      path.resolve(__dirname, 'assets', 'empty')
    );
    expect(actual.length).toEqual(0);
  });

  test('should throw exception if directory does not exist', () => {
    expect(() => {
      getAllHandlebarsFiles(
        '.hbs',
        path.resolve(__dirname, 'assets', 'nonexistent')
      );
    }).toThrowError();
  });
});

describe('convertFilePathToPartialName', () => {
  test('should convert file path to partial name', () => {
    const actual = convertFilePathToPartialName(
      '.hbs',
      path.resolve(__dirname, 'assets'),
      path.resolve(__dirname, 'assets', 'test1.hbs')
    );
    expect(actual).toEqual('test1');
  });

  test('should convert subdirectory file path to partial name', () => {
    const actual = convertFilePathToPartialName(
      '.hbs',
      path.resolve(__dirname, 'assets'),
      path.resolve(__dirname, 'assets', 'sub', 'test3.hbs')
    );
    expect(actual).toEqual('sub/test3');
  });

  test('should convert file path with spaces to partial name', () => {
    const actual = convertFilePathToPartialName(
      '.hbs',
      path.resolve(__dirname, 'assets'),
      path.resolve(__dirname, 'assets', 'test 2.hbs')
    );
    expect(actual).toEqual('test 2');
  });
});

describe('loadAndCompileFile', () => {
  test('should load and compile file', () => {
    const filePath = path.resolve(__dirname, 'assets', 'test1.hbs');
    const actual = loadAndCompileFile(filePath);
    expect(actual).toContain('function');
    expect(actual).toContain('return');
    expect(actual).toContain(
      '<div>\\n    <h1>Test 1</h1>\\n    <p>Test 1 content</p>\\n</div>'
    );
  });
});

describe('loadAndCompileFiles', () => {
  test('should load and compile files', () => {
    const baseDirectoryPath = path.resolve(__dirname, 'assets');
    const filePaths = getAllHandlebarsFiles('.hbs', baseDirectoryPath);
    const actual = loadAndCompileFiles('.hbs', baseDirectoryPath, filePaths);
    expect(actual).toEqual({
      'sub/test3': expect.any(String),
      'test 2': expect.any(String),
      test1: expect.any(String),
    });
  });
});

describe('createPartialMap', () => {
  test('should create a partial map', () => {
    const partialDirectoryPath = path.resolve(__dirname, 'assets');
    const actual = createPartialMap('.hbs', partialDirectoryPath);
    expect(actual).toEqual({
      'sub/test3': expect.any(String),
      'test 2': expect.any(String),
      test1: expect.any(String),
    });
  });

  test('should return empty map because directory path not specified', () => {
    const partialDirectoryPath = path.resolve(__dirname, 'assets');
    const actual = createPartialMap('.hbs', undefined);
    expect(Object.keys(actual).length).toEqual(0);
  });
});

describe('decideTemplateFileExtension', () => {
  test('should return .hbs if no extension specified', () => {
    const actual = decideTemplateFileExtension();
    expect(actual).toEqual('.hbs');
  });

  test('should return the extension if it starts with a dot', () => {
    const actual = decideTemplateFileExtension('.html');
    expect(actual).toEqual('.html');
  });

  test('should return the extension with a dot if it does not start with a dot', () => {
    const actual = decideTemplateFileExtension('html');
    expect(actual).toEqual('.html');
  });
});
