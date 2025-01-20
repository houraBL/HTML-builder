const { stdout } = process;
const fs = require('fs').promises;
const path = require('path');

const destPath = path.join(__dirname, 'project-dist');
const destAssetsPath = path.join(destPath, 'assets');
const stylesPath = path.join(__dirname, 'styles');
const componentsPath = path.join(__dirname, 'components');
const assetsPath = path.join(__dirname, 'assets');
const templatePath = path.join(__dirname, 'template.html');

//stdout.write(fs.access(destPath));

const removeFiles = async (path) => {
  let destFolder = true;
  try {
    await fs.access(path); // Check if folder exists
  } catch (error) {
    destFolder = false;
    stdout.write('folder does not exist');
  }
  if (destFolder) {
    try {
      const files = await fs.readdir(path);
      for (const file of files) {
        stdout.write('\nremoving: ' + file);
        await fs.rm(path.join(path, file));
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

const createFolder = async (folderPath) => {
  try {
    try {
      await fs.access(folderPath);
      stdout.write('\nfolder exist\n');
    } catch {
      await fs.mkdir(folderPath, { recursive: true });
      stdout.write('\nfolder was created\n');
    }
  } catch (error) {
    stdout.write('\ncannot create folder: ' + error.message + '\n');
  }
};

const copyFiles = async (source, folderPath) => {
  try {
    const files = await fs.readdir(source);
    for (const file of files) {
      const sourcePath = path.join(source, file);
      const destFilePath = path.join(folderPath, file);
      stdout.write('\ncopying: ' + file);
      const stats = await fs.stat(sourcePath);
      if (stats.isDirectory()) {
        stdout.write('\ncopying folder: ' + file);
        await createFolder(destFilePath, { recursive: true });
        await copyFiles(sourcePath, destFilePath);
      } else {
        await fs.copyFile(sourcePath, destFilePath);
      }
    }
  } catch (error) {
    stdout.write('\ncannot copy\n' + error.message);
  }
};

const copyDir = async (source, folderPath) => {
  await removeFiles(folderPath);
  await createFolder(folderPath);
  await copyFiles(source, folderPath);
};

const removeStyleFile = async () => {
  try {
    const files = await fs.readdir(destPath);
    for (const file of files) {
      if (file === 'style.css') {
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
    const files = await fs.readdir(stylesPath);
    for (const file of files) {
      const type = file.split('.').at(file.split('.').length - 1);

      if (type === 'css') {
        const fileData = await fs.readFile(
          path.join(stylesPath, file),
          'utf-8',
        );
        data += fileData + '\n';
        stdout.write('\nfile ' + file + ' was read\n');
      }
    }

    await fs.writeFile(path.join(destPath, 'style.css'), data, 'utf-8');
  } catch (error) {
    stdout.write('some error occurred\n' + error.message);
  }
};

const mergeStyles = async () => {
  await removeStyleFile();
  await assembleStyles();
};

const insertAssetsToHTML = async () => {
  try {
    let templateData = await fs.readFile(templatePath, 'utf-8');
    const files = await fs.readdir(componentsPath);
    for (const file of files) {
      const type = file.split('.').at(file.split('.').length - 1);

      if (type === 'html') {
        const componentPath = path.join(componentsPath, file);
        const componentContent = await fs.readFile(componentPath, 'utf-8');
        stdout.write('\nfile ' + file + ' was read\n');
        templateData = templateData.replace(
          `{{${file.split('.')[0]}}}`,
          componentContent,
        );
      }
    }

    await fs.writeFile(
      path.join(destPath, 'index.html'),
      templateData,
      'utf-8',
    );
  } catch (error) {
    stdout.write('some error occurred\n' + error.message);
  }
};

const buildPage = async () => {
  await createFolder(destPath);
  await copyDir(assetsPath, destAssetsPath);
  await mergeStyles();
  await insertAssetsToHTML();
};

buildPage();
