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
var ChatList = require('./models/chatlist');
var chatList = new ChatList();
var registerHandler = require('./handler/register');
var loginHandler = require('./handler/login');
var listHandler = require('./handler/list');
var broadcastHandler = require('./handler/broadcast');
var logoutHandler = require('./handler/logout');
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
    // manifest online chaters

    io.on('connection', function(socket) {
        console.log('\n服务器：有新的连接请求');
        console.log('\n客户端的IP为：' + socket.handshake.address);
        console.log('\n请求的路径：' + socket.handshake.headers.referer + '\n');
        socket.emit('welcome', socket.handshake.address);
        socket.on('message', function(message) {
            switch (message.action) {
                //请求在线用户列表
                case 'list':
                    listHandler.handle(socket, message, chatList);
                    break;
                    //用户注册
                case 'register':
                    registerHandler.handle(socket, message, chatList);
                    break;
                    //广播消息
                case 'broadcast':
                    broadcastHandler.handle(socket, message);
                    break;
                    //登陆
                case 'login':
                    loginHandler.handle(socket, message, chatList);
                    break;
                    //登出
                case 'logout':
                    logoutHandler.handle(socket, message, chatList);
                    break;
            }
        });

        socket.on('disconnect', function() {
            console.log('\n服务器：连接已关闭');
        });
    });
});

module.exports = app;