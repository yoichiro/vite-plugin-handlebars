# @yoichiro/vite-plugin-handlebars

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
npm install @yoichiro/vite-plugin-handlebars --save-dev
```

# Usage

To use this plugin in your Vite project, modify your `vite.config.js` or `vite.config.ts` file as follows:

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import handlebarsPlugin from '@yoichiro/vite-plugin-handlebars';

export default defineConfig({
  plugins: [
    handlebarsPlugin()
  ]
});
```

## Options

This plugin can be configured with the following options:

* `templateFileExtension` (string) - Specifies the extension of Handlebars template files. Defaults to `hbs` if omitted.
* `partialDirectoryPath` (string) - Specifies the path to the directory containing partial template files to be included in Handlebars template files. If omitted, partial template files are not registered.
* `optimizePartialRegistration` (boolean) - Set to true to optimize the partial registration. This option is effective only when `partialsDirectoryPath` is set. If omitted, the plugin does not optimize the partial registration. If true, the plugin does not register the partials that are already registered.
* `compileOptions` (object) - Specifies the options to be passed to the Handlebars compiler. If omitted, the default options are used.

These options can be specified as arguments to the `handlebarsPlugin` function. Below is an example that specifies `handlebars` as the template file extension and `templates/partials` as the directory containing partial template files.

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import handlebarsPlugin from '@yoichiro/vite-plugin-handlebars';
import path from 'path';

export default defineConfig({
  plugins: [
    handlebarsPlugin({
      templateFileExtension: 'handlebars',
      partialDirectoryPath: path.resolve(__dirname, 'templates', 'partials'),
      optimizePartialRegistration: true,
    })
  ]
});
```

The `compileOptions` are the various options applied when compiling template files in Handlebars. For details on each option, please refer to the [Handlebars documentation](https://handlebarsjs.com/api-reference/compilation.html#handlebars-compile-template-options).

# Samples

The `integration` directory contains a sample Vite project using this plugin. You can start this sample project by following these steps:

```sh
$ git clone https://github.com/yoichiro/vite-plugin-handlebars.git
$ cd vite-plugin-handlebars
$ npm install
$ npm run integration-preview
```

After the development server starts, please access `http://localhost:5173` in your web browser.

# Contributing

If you would like to contribute to this plugin, please follow these steps:

1. Register an issue and describe what you would like to contribute.
2. When you want to contribute by sending code, fork this repository, create a new branch, make your code changes, and submit a pull request.

# License

For the license of this plugin, please refer to the [LICENSE](https://github.com/yoichiro/vite-plugin-handlebars-import/blob/main/LICENSE) file.
