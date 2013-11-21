var express = require('express');
var app = express();
var path = require('path');
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var users = {};
var ipaddress = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
var port = process.env.OPENSHIFT_NODEJS_PORT || 3000

app.use(express.static(path.join(__dirname, 'public')));

server.listen(port, ipaddress);

app.get('/', function(req, res) {
    res.sendfile(__dirname + '/views/index.html');
});

io.sockets.on('connection', function(socket) {

    socket.on('send message', function(data, callback) {
        var msg = data.trim();
        if(msg.substr(0, 3) === '/w ') {
            msg = msg.substr(3);
            var ind = msg.indexOf(' ');
            if(ind !== -1) {
                var name = msg.substring(0, ind);
                var msg = msg.substring(ind + 1);

                if(name in users) {
                    users[name].emit('whisper',
                        { msg: msg,
                          user: socket.nickname
                      });
                   console.log('whisper ' + msg);
                } else {
                    callback('enter valid users');
                }

            } else {
                callback('Please Enter your message for whisper');
            }

        } else {
            io.sockets.emit('new message', {msg: msg, user: socket.nickname});
        }
    });

    function updateNicknames() {
        io.sockets.emit('username', Object.keys(users));
    }

    socket.on('new user', function(data, callback) {
        if(data in users) {
            callback(false);
        } else {
            callback(true);
            socket.nickname = data;
            users[socket.nickname] = socket;
            updateNicknames();
        }
    });

    socket.on('disconnect', function(data) {
        if(!socket.nickname) return;
        delete users[socket.nickname];
        updateNicknames();
    });

});




