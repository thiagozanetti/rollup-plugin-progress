## rollup-plugin-progressbar

Show current module being transpiled by the rollup bundler.

### Installation

```sh
npm i rollup-plugin-progressbar --save-dev
```

### Usage

Include the following in the rollup config

#### Modern mode:

```js
import { rollup } from 'rollup';
import progressbar from 'rollup-plugin-progressbar';

rollup({
  entry: 'main.js',
  plugins: [
    progressbar(),
  ],
}).then(bundle => bundle.write({ dest: 'bundle.js', format: 'iife' }));
```

#### With custom settings:

```js
import { rollup } from 'rollup';
import progressbar from 'rollup-plugin-progressbar';

rollup({
  entry: 'main.js',
  plugins: [
    progressbar({
      modern: {
        format: '({value}/{total}): {file} {bar} {percentage}%', // default: 'Building... {bar} {percentage}% ({value}/{total}): {file}'
        preset: 'classic', // default: 'shades-grey'
      }
    }),
  ],
}).then(bundle => bundle.write({ dest: 'bundle.js', format: 'iife' }));
```

#### Legacy mode:

```js
import { rollup } from 'rollup';
import progressbar from 'rollup-plugin-progressbar';

rollup({
  entry: 'main.js',
  plugins: [
    progressbar({
      modern: false, // default: true
      clearLine: false, // default: true
    }),
  ],
}).then(bundle => bundle.write({ dest: 'bundle.js', format: 'iife' }));
```
