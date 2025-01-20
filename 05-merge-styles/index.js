const { stdout } = process;
const fs = require('fs').promises;
const path = require('path');

const srcPath = path.join(__dirname, 'styles');
const destPath = path.join(__dirname, 'project-dist');

const removeBundleFile = async () => {
  try {
    const files = await fs.readdir(destPath);
    for (const file of files) {
      if (file === 'bundle.css') {
        stdout.write('\nremoving: ' + file);
        await fs.rm(path.join(destPath, file));
      }
    }
    stdout.write('\nfile was removed\n');
  } catch (error) {
    stdout.write('some error occurred\n' + error.message);
  }
};

const assembleStyles = async () => {
  try {
    let data = '';
    const files = await fs.readdir(srcPath);
    for (const file of files) {
      const type = file.split('.').at(file.split('.').length - 1);

      if (type === 'css') {
        const fileData = await fs.readFile(path.join(srcPath, file), 'utf-8');
        data += fileData + '\n';
        stdout.write('\nfile ' + file + ' was read\n');
      }
    }

    await fs.writeFile(path.join(destPath, 'bundle.css'), data, 'utf-8');
  } catch (error) {
    stdout.write('some error occurred\n' + error.message);
  }
};

const mergeStyles = async () => {
  await removeBundleFile();
  await assembleStyles();
};

mergeStyles();
