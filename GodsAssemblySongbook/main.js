const { exec } = require('child_process');

console.log('Run the Gas API...');
exec('node ' + 'api/main.js', (err, stdout, stderr) => {
  if (err) {
    console.error(`Gas API exec error: ${err}`);
    return;
  }

  console.log(`Gas API: ${stdout}`);
});

console.log('Run the Gas UI...');
exec('npx http-server ./client/ -o -p 8099', (err, stdout, stderr) => {
  if (err) {
    console.error(`Gas UI exec error: ${err}`);
    return;
  }

  console.log(`Gas UI: ${stdout}`);
});


