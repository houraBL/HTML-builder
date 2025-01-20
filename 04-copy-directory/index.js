const { stdout } = process;
const fs = require('fs').promises;
const path = require('path');

const srcPath = path.join(__dirname, 'files');
const destPath = path.join(__dirname, 'files-copy');
//stdout.write(fs.access(destPath));

const removeFiles = async () => {
  let destFolder = true;
  try {
    await fs.access(destPath); // Check if folder exists
  } catch (error) {
    destFolder = false;
    stdout.write('folder does not exist');
  }
  if (destFolder) {
    try {
      const files = await fs.readdir(destPath);
      for (const file of files) {
        stdout.write('\nremoving: ' + file);
        await fs.rm(path.join(destPath, file));
      }
      stdout.write('\nfiles were removed\n');
    } catch (error) {
      if (error.code === 'ENOENT' || error.code === 'ERR_UNKNOWN_ENCODING') {
        stdout.write('\ndest folder does not exist\n' + error.message);
      } else {
        stdout.write('\ncannot access destination folder:\n' + error.message);
      }
    }
  }
};

const createFolder = async () => {
  try {
    try {
      await fs.access(destPath);
      stdout.write('\nfolder exist\n');
    } catch {
      await fs.mkdir(destPath, { recursive: true });
      stdout.write('\nfolder was created\n');
    }
  } catch (error) {
    stdout.write('\ncannot create folder: ' + error.message + '\n');
  }
};

const copyFiles = async () => {
  try {
    const files = await fs.readdir(srcPath);
    for (const file of files) {
      stdout.write('\ncopying: ' + file);
      await fs.copyFile(path.join(srcPath, file), path.join(destPath, file));
    }
  } catch (error) {
    stdout.write('\ncannot copy\n' + error.message);
  }
};

const copyDir = async () => {
  await removeFiles();
  await createFolder();
  await copyFiles();
};

copyDir();
