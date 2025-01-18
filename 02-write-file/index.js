const { stdout, stdin, exit } = process;
const fs = require('fs');
const path = require('path');

const output = fs.createWriteStream(path.join(__dirname, 'text.txt'), 'utf-8');

stdout.write('Hello! Please enter whatever you want to check this task:\n');
stdin.on('data', (data) => {
  if (data.toString().trim() === 'exit') {
    stdout.write('\n--\nYou typed exit, thats the end of the program');
    exit();
  }
  output.write(data);
});

process.on('SIGINT', () => {
  stdout.write(
    '\n--\nYou have pressed ctrl + c, thats the end of the program. Thanks for checking my work!',
  );
  exit();
});

output.on('error', (error) =>
  console.log('Cannot read the file: ERR:', error.message),
);
