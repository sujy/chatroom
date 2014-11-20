var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes = require('./routes/index');
var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

var db = require('./models/db');
var User = require('./models/user');
var Chatlist = require('./models/chatlist');
var chatlist = new Chatlist();
db.getConnection(function(db) {
    app.use(function(req, res, next) {
        req.db = db;
        next();
    });

    //全局路由控制
    app.use('/', require('./routes/index'));
    app.use('/register', require('./routes/register'));
    app.use('/chat', require('./routes/chat'));

    //启动服务器(绑定socket.io)
    var server = require('http').Server(app);
    server.listen(3000);
    var io = require('socket.io')(server);
    var _source, _destination,_statusCode,_data;

    var response;

    // manifest online chaters

    io.on('connection', function(socket) {
        console.log('服务器：有新的连接请求');
        console.log('请求的路径:\n' + socket.handshake.headers.referer);
        socket.emit('welcome', socket.handshake.address);
        socket.on('message', function(message) {
        		if (message.action == 'list') {
                _source = {
                    ip: message.destination.ip,
                    port: message.destination.port
                };
                _destination = {
                    ip: message.source.ip,
                    port: message.source.port
                };
                if (chatlist.namelist != []) {
                	_statusCode = 400;
                	_data = chatlist.namelist;
                	response = packageResponseMessage(_statusCode, _source, _destination, _data);
                } else {
                	_statusCode = 404;
                	_data = "Cant get online chaters list!";
                	response = packageResponseMessage(_statusCode, _source, _destination, _data);
                }
                socket.broadcast.emit('response', response);
                socket.emit('response', response);
        		}

            if (message.action == 'register') {
                console.log('服务器：请求注册的用户名为——' + message.data.username);
                console.log('服务器：请求注册的密码为——' + message.data.password);
                _source = {
                    ip: message.destination.ip,
                    port: message.destination.port
                };
                _destination = {
                    ip: message.source.ip,
                    port: message.source.port
                };
                User.get(message.data.username, function(err, data) {
                    console.log('服务器：err->' + err + '\n服务器：data->' + data);
                    if (data) {
                        _statusCode = 104;
                        _data = '用户' + message.data.username + '已经存在！请重新输入';
                        response = packageResponseMessage(_statusCode, _source, _destination, _data);
                        console.log('服务器：用户' + message.data.username + '已经存在');
                        socket.emit('response', response);
                    } else {
                        var newUser = new User(message.data);
                        newUser.save(function(status, data) {
                            _statusCode = 100;
                            _data = '用户注册成功';
                            console.log('服务器：添加用户' + message.data.username + '成功');
                            response = packageResponseMessage(_statusCode, _source, _destination, _data);
                            // add username into chatlist
                            chatlist.add(message.data.username);
                            socket.emit('response', response);
                        });
                    }
                });
            }
        });

        socket.on('chat', function(message) {
            console.log(message);
            socket.broadcast.emit('chat', message);
            socket.emit('chat', message);
        });

        socket.on('disconnect', function() {
            console.log('服务器：连接已关闭');
        });
    });
});


function packageResponseMessage(_statusCode, _source, _destination, _data) {
    var object = {
        statusCode: _statusCode,
        source: {
            ip: _source.ip,
            port: _source.port
        },
        destination: {
            ip: _destination.ip,
            port: _destination.port
        },
        data: _data
    };
    return object;
}

module.exports = app;