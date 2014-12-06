var USERNAME = 'Mr.X';
/**
 *  设置用户名函数
 **/
function setUser() {
    var url = window.location.toString();
    var info = url.split('?');
    if(info.length > 1){
        USERNAME = info[1];
    }
}
/**
 *  返回用户名函数
 **/
function getUser() {
    return USERNAME;
}

function packageMessage(_action, _source, _destination, _cookie, _data) {
    var object = {
        action: _action,
        source: {
            ip: _source.ip,
            port: _source.portaddr
        },
        destination: {
            ip: _destination.ip,
            port: _destination.portaddr
        },
        cookie: _cookie,
        data: _data
    };
    return object;
}