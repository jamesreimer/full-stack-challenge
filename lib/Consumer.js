'use strict';

var net        = require('net');
var Expression = require('./Expression');
var Logger     = require('./Logger');

function Consumer(options) {
  options      = options || {};
  this.port    = options.port || 0;
  this.host    = options.host || '127.0.0.1';
  this._server = null;

  Logger.log('Consumer started.');

  this._connect();
}

Consumer.prototype._connect = function () {
  if (this._server) {
    return;
  }

  var self = this;

  var createServer = function () {
    return net
      .createServer()
      .listen(self.port, self.host)
      .on('error', function (err) {
        self._server = null;
        if (err.code == 'EADDRINUSE') {
          Logger.log('Address in use, retrying...');
          setTimeout(function () {
            self._server.close();
            createServer();
          }, 1000);
        }
      })
      .on('listening', function () {
        Logger.log('Consumer listening at ' + self._server.address().address + ':' + self._server.address().port);
      })
      .on('connection', function (sock) {
        sock.on('data', function(data) {
          data = JSON.parse(data);

          Logger.log('Server received expression: ' + data.integers[0] + data.operator + data.integers[1] + ' [' + self._getTimestamp() + ']');

          var expression = new Expression(data);
          expression.calculate();

          if (expression.result) {
            Logger.log('Consumer sending solved expression: ' + expression.toString() + ' [' + self._getTimestamp() + ']');
            sock.write(expression.toJSON());
          } else {
            Logger.log('Invalid expression. Consumer sending error message: ' + expression.toString() + ' [' + self._getTimestamp() + ']');
            sock.write(JSON.stringify({error: true}));
          }
        });
      })
      .on('close', function () {
        Logger.log('Consumer stopped.');
      });
  };

  this._server = createServer();
};

Consumer.prototype.close = function (cb) {
  this._server.close(cb);
};

Consumer.prototype.getPort = function () {
  return this._server.address().port;
};

Consumer.prototype.getHost = function () {
  return this._server.address().address;
};

Consumer.prototype._getTimestamp = function () {
  return new Date()
    .toISOString()
    .replace(/T/, ' ')
    .replace(/\..+/, '');
};

module.exports = Consumer;
