const { stdout } = process;

const fs = require('fs');
const path = require('path');

const readableStream = fs.createReadStream(
  path.join(__dirname, 'text.txt'),
  'utf-8',
);

let data = '';
readableStream.on('data', (chunk) => (data += chunk));
readableStream.on('end', () => {
  stdout.write(data);
});
readableStream.on('error', (error) =>
  console.log('Cannot read the file: ERR:', error.message),
);
