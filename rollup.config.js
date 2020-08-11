import buble from '@rollup/plugin-buble';

import pkg from './package.json';

const external = Object.keys(pkg.dependencies).concat(['fs', 'path', 'crypto', 'os']);

export default {
  external,
  input: 'src/index.js',
  output: [
    { file: pkg.main, format: 'cjs', exports: 'default', },
    { file: pkg.module, format: 'es', exports: 'default', },
  ],
  plugins: [ buble() ],
};
