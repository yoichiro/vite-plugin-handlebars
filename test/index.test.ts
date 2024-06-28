import { describe, expect, test } from 'vitest';
import handlebarsImportPlugin from '../src';
import path from 'path';

describe('handlebarsImportPlugin', () => {
  test('should return the plugin name', () => {
    const plugin = handlebarsImportPlugin({ partialsDirectoryPath: '' });
    expect(plugin.name).toEqual('vite-plugin-handlebars-import');
  });
});
