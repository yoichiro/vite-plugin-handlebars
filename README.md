# vite-plugin-handlebars-import

This is a plugin that provides convenient features for using Handlebars with Vite.

## Features

By using this plugin, you can import Handlebars template files as modules in projects that use Vite.

For example, suppose you have the following Handlebars template file (`templates/card.hbs`):

```html
<div class="card">
  <p>{{ message }}</p>
</div>
```

With this plugin, you can import and use `card.hbs` as follows:

```javascript
import template from 'templates/card.hbs';

const card = template({ message: 'Hello, world!' });
const elem = document.getElementById('target');
elem.innerHTML = card;
```

Also, suppose you have the following partial file (`templates/partials/footer.hbs`):

```html
<div class="footer">
  <p>Powered by Vite and Handlebars.</p>
</div>
```

Then, include it in the `card.hbs` file as follows:

```html
<div class="card">
  <p>{{ message }}</p>
  {{> footer}}
</div>
```

This plugin automatically loads the `footer.hbs` file and includes it in the `card.hbs` file.

# Installation

```shell
npm install vite-plugin-handlebars-import --save-dev
```

# Usage

To use this plugin in your Vite project, modify your `vite.config.js` or `vite.config.ts` file as follows:

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import handlebarsImportPlugin from 'vite-plugin-handlebars-import';

export default defineConfig({
  plugins: [
    handlebarsImportPlugin()
  ]
});
```

## Options

This plugin can be configured with the following options:

* `templateFileExtension` (string) - Specifies the extension of Handlebars template files. Defaults to `hbs` if omitted.
* `partialDirectoryPath` (string) - Specifies the path to the directory containing partial template files to be included in Handlebars template files. If omitted, partial template files are not registered.

These options can be specified as arguments to the `handlebarsImportPlugin` function. Below is an example that specifies `handlebars` as the template file extension and `templates/partials` as the directory containing partial template files.

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import handlebarsImportPlugin from 'vite-plugin-handlebars-import';
import path from 'path';

export default defineConfig({
  plugins: [
    handlebarsImportPlugin({
      templateFileExtension: 'handlebars',
      partialDirectoryPath: path.resolve(__dirname, 'templates', 'partials')
    })
  ]
});
```

# Contributing

If you would like to contribute to this plugin, please follow these steps:

1. Register an issue and describe what you would like to contribute.
2. Fork this repository, create a new branch, make your code changes, and submit a pull request.

# License

For the license of this plugin, please refer to the [LICENSE](https://github.com/yoichiro/vite-plugin-handlebars-import/blob/main/LICENSE) file.
