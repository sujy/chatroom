exports.packageResponseMessage = function(_statusCode, _source, _destination, _data) {
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
};