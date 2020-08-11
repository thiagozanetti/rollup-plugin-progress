import fs from 'fs';
import path from 'path';
import os from 'os';
import { createHash } from 'crypto';

import chalk from 'chalk';
import cliProgress from 'cli-progress';

const isObject = value => value && typeof value === 'object' && value.constructor === Object;
const isBoolean = value => typeof value === 'boolean';
const normalizePath = (id, type = 'relative') => path[type](process.cwd(), id).split(path.sep).join('/');
const initialFormat = 'Building... {bar} {percentage}% ({value}/{total}): {file}';

export default ({ modern = true, clearLine = true } = {}) => {
  let { format = initialFormat, preset = 'shades_grey' } = {};

  if (isObject(modern)) {
    ({ format = initialFormat, preset = 'shades_grey' } = modern);
  }

  const isModern = (isBoolean(modern) && !!modern) || isObject(modern);

  let totalFilePath;

  const progress = {
    total: 0,
    loaded: 0,
  };

  let progressbar = null;
  
  if (isModern) {
    progressbar = new cliProgress.Bar({
      format,
    }, cliProgress.Presets[preset]);
  }


  return {
    name: 'progress',
    buildStart({ input: [ firstEntry ] }) {
      let total = 0;

      const hash = createHash('md5').update(normalizePath(firstEntry, 'resolve')).digest('hex');

      console.log(`./rollup-plugin-progress-${hash}`);

      totalFilePath = path.resolve(os.tmpdir(), `./rollup-plugin-progress-${hash}`);

      try {
        total = fs.readFileSync(totalFilePath);
      } catch (e) {
        fs.writeFileSync(totalFilePath, "0");
      }

      progress.total = total;

      if (isModern) {
        progressbar.start(total, 0, { file: '' });
      }
    },
    load() {  
      progress.loaded += 1;
    },
    transform(_, id) {
      const file = normalizePath(id);

      if (file.includes(':')) {
        return;
      }

      if (isModern) {
        if (progress.loaded > progress.total) {
          progressbar.setTotal(progress.loaded);
        }

        progressbar.update(progress.loaded, { file });
      } else {
          if (clearLine && process.stdout.isTTY) {
            process.stdout.clearLine();
            process.stdout.cursorTo(0);
  
            let output = "";
  
            if (progress.total > 0) {
              let percent = Math.round(100 * progress.loaded / progress.total);
  
              output += Math.min(100, percent) + "% ";
            }
  
            output += `(${chalk.red(progress.loaded)}): ${file}`;
  
            if (output.length < process.stdout.columns) {
              process.stdout.write(output);
            } else {
              process.stdout.write(output.substring(0, process.stdout.columns - 1));
            }
          } else {
            console.log(`(${chalk.red(progress.loaded)}): ${file}`);
          }
      }
    },
    generateBundle() {
      // values may differ in some conditions. We need to prevent a bad ux.
      progressbar.setTotal(progress.loaded);

      fs.writeFileSync(totalFilePath, String(progress.loaded));

      if (isModern) {
        progressbar.stop();
      } else {
        if (clearLine && process.stdout.isTTY) {
          process.stdout.clearLine();
          process.stdout.cursorTo(0);
        }
      }
    },
  };
}
