const FTPServer = require('ftp-srv');

const hostname = "127.0.0.1";
const port = 8083;

const ftpServer = new FTPServer('ftp://' + hostname + ":" + port, {
    anonymous: true, greeting: ["Hello User!", "How's your day?"]
});

ftpServer.on('login', (data, resolve, reject) => {
    console.log('data: ' + data);
    console.log('resolve: ' + resolve);
    console.log('reject: ' + reject);

});

ftpServer.on('client-error', (connection, context, error) => {
    console.log('connection: ' + connection);
    console.log('context: ' + context);
    console.log('error: ' + error);
});


ftpServer.listen()
    .then(() => {
        console.log(`Server running at http://${hostname}:${port}/`);
    });