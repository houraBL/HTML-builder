const { stdout } = process;

const fs = require('fs');
const path = require('path');

fs.readdir(
  path.join(__dirname, 'secret-folder'),
  { withFileTypes: true },
  (error, files) => {
    if (error) {
      stdout.write('Cannot read the dir: ERR:', error.message);
    }
    files.forEach((file) => {
      if (!file.isDirectory()) {
        const name = file.name.split('.')[0];
        const type = file.name.split('.').at(file.name.split('.').length - 1);
        fs.stat(
          path.join(__dirname, 'secret-folder', file.name),
          (error, stats) => {
            if (error) {
              stdout.write('Cannot read the dir: ERR:', error.message);
            }
            const size = stats.size;
            stdout.write(
              name + ' - ' + type + ' - ' + (size / 1000).toFixed(3) + 'kb\n',
            );
          },
        );
      }
    });
  },
);
