//https://github.com/wayou/HiChat
var express = require('express'),
    app = express(),
    http = require('http').createServer(app),
    io = require('socket.io')(http),
    cors = require('cors'),
    users = [],
    figlet = require('figlet');

const expressSanitizer = require("express-sanitizer");
const https = require("https");
const fs = require("fs");
//io = require('socket.io')(https);


//specify the html we will use
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(expressSanitizer());
app.use('/', express.static(__dirname + '/www'));
//bind the server to the 80 port
//server.listen(3000);//for local test
const port_http = process.env.PORT || 8080;

http.listen(port_http, () => {
    figlet(`HTTP Server started on port ${port_http}`, function (err, data) {
        if (err) {
            console.log('Something went wrong...');
            console.dir(err);
            return;
        }
        console.log(data)
    });
});

const options = {
    key: fs.readFileSync("./config/cert.key"),
    cert: fs.readFileSync("./config/cert.crt"),
};

const port_https = 8443;
https.createServer(options, app).listen(port_https, () => {
    figlet(`HTTPS Server started on port ${port_https}`, function (err, data) {
        if (err) {
            console.log('Something went wrong...');
            console.dir(err);
            return;
        }
        console.log(data)
    });
});












//server.listen(process.env.OPENSHIFT_NODEJS_PORT || 3000);//publish to openshift
//console.log('server started on port'+process.env.PORT || 3000);
//handle the socket
io.sockets.on('connection', function (socket) {
    //new user login
    socket.on('login', function (nickname) {
        if (users.indexOf(nickname) > -1) {
            socket.emit('nickExisted');
        } else {
            //socket.userIndex = users.length;
            socket.nickname = nickname;
            users.push(nickname);
            socket.emit('loginSuccess');
            io.sockets.emit('system', nickname, users.length, 'login');
        };
    });
    //user leaves
    socket.on('disconnect', function () {
        if (socket.nickname != null) {
            //users.splice(socket.userIndex, 1);
            users.splice(users.indexOf(socket.nickname), 1);
            socket.broadcast.emit('system', socket.nickname, users.length, 'logout');
        }
    });
    //new message get
    socket.on('postMsg', function (msg, color) {
        socket.broadcast.emit('newMsg', socket.nickname, msg, color);
    });
    //new image get
    socket.on('img', function (imgData, color) {
        socket.broadcast.emit('newImg', socket.nickname, imgData, color);
    });

    socket.on('location', function (data) {
        socket.broadcast.emit('location', socket.nickname, data);
    });
});
