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
db.getConnection(function(db) {
    app.use(function(req, res, next) {
        req.db = db;
        next();
    });

    //全局路由控制
    app.use('/', require('./routes/index'));
    app.use('/register', require('./routes/register'));

    //启动服务器(绑定socket.io)
    var server = require('http').Server(app);
    server.listen(3000);
    var io = require('socket.io')(server);

    io.on('connection', function(socket) {
        console.log('服务器：有新的连接请求');

        socket.emit('welcome');

        socket.on('register', function(user) {
            console.log(user);
            console.log('服务器：请求注册的用户名为——' + user.username);
            console.log('服务器：请求注册的密码为——' + user.password);
        });

        socket.on('disconnect', function() {
            console.log('服务器：连接已关闭');
        });
    });
});

module.exports = app;