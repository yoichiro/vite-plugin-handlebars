import { describe, expect, test } from 'vitest';
import handlebarsPlugin from '../src';
import path from 'path';

describe('handlebarsPlugin', () => {
  test('should return the plugin name', () => {
    const plugin = handlebarsPlugin({ partialsDirectoryPath: '' });
    expect(plugin.name).toEqual('@yoichiro/vite-plugin-handlebars');
  });
});
