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
exec('npx http-server ./client/ -o --cors --mimetypes ./mime.types -a 0.0.0.0 -p 80', (err, stdout, stderr) => {
    if (err) {
        console.error(`Gas UI exec error: ${err}`);
        return;
    }

    console.log(`Gas UI: ${stdout}`);
});


//  start @TODO 20231201: add some documentation or testing to catch this use-case error

//  https://stackoverflow.com/questions/60372618/nodejs-listen-eacces-permission-denied-0-0-0-080

// Give Safe User Permission To Use Port 80

// Remember, you do NOT want to run your applications as the root user, but there is a hitch: your safe user does not have permission to use the default HTTP port (80). Your goal is to be able to publish a website that visitors can use by navigating to an easy to use URL like http://ip:port/

// Unfortunately, unless you sign on as root, you’ll normally have to use a URL like http://ip:port - where port number > 1024.

// A lot of people get stuck here, but the solution is easy. There a few options but this is the one I like. Type the following commands:

// > sudo apt-get install libcap2-bin 
// > sudo setcap cap_net_bind_service=+ep `readlink -f \`which node\`` 

// Now, when you tell a Node application that you want it to run on port 80, it will not complain.

// end @TODO 20231201
