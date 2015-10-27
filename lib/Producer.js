'use strict';

var net        = require('net');
var Expression = require('./Expression');
var Logger     = require('./Logger');

function Producer(options) {
  options         = options || {};
  this.port       = options.port || 0;
  this.host       = options.host || '127.0.0.1';
  this._socket    = null;
  this._callbacks = [];
  this._interval  = null;

  Logger.log('Producer started.');

  this.start();
}

Producer.prototype.start = function () {
  this._interval  = setInterval(function (self) {
    var operators = ['+', '-', '*', '/', '^'];
    var expression = new Expression(operators[Math.floor(Math.random() * (operators.length + 1))]);

    self.write(expression.toJSON(), function () {
      Logger.log('Producer sending expression: ' + expression.toString() + ' [' + self._getTimestamp() + ']');
    });
  }, 500, this);
};

Producer.stop = function () {
  clearInterval(this._interval);
};

Producer.prototype.write = function (/* data, encoding, cb */) {
  var self = this;
  var args = Array.prototype.slice.call(arguments);
  var cb   = args[args.length - 1];

  if (typeof cb === 'function') {
    var cbProxy = function () {
      var index = self._callbacks.indexOf(cbProxy);

      if (index < 0) {
        return;
      }

      self._callbacks.splice(index, 1);

      return cb.apply(this, arguments);
    };

    args[args.length - 1] = cbProxy;
    this._callbacks.push(cbProxy);
  }

  this._connect();

  try {
    this._socket.write.apply(this._socket, args);
  } catch (err) {
    if (cbProxy) {
      cbProxy(err);
    }

    this._socket.destroy();
    this._socket = null;
  }
};

Producer.prototype._connect = function () {
  if (this._socket) {
    return;
  }

  var onError = function (err) {
    self._socket = null;
    for (var i = self._callbacks.length - 1; i >= 0; i--) {
      self._callbacks[i](err);
    }
  };

  var self = this;

  this._socket = net
    .createConnection(this.port, this.host)
    .setEncoding(this.encoding)
    .on('error', onError)
    .on('data', function (data) {
      data = JSON.parse(data);

      if (data.hasOwnProperty('error')) {
        Logger.log('Producer received error message: ' + data.integers[0] + data.operator + data.integers[1] +
          '=' + data.result + ' [' + self._getTimestamp() + ']');
      } else {
        Logger.log('Producer received solved expression: ' + data.integers[0] + data.operator + data.integers[1] +
          '=' + data.result + ' [' + self._getTimestamp() + ']');
      }
    });

  if (this.timeout) {
    this._socket.setTimeout(this.timeout, function () {
      self._socket.end();
      onError('timeout');
    });
  }
};

Producer.prototype.end = function () {
  if (this._socket) {
    this._socket.end();
    Logger.log('Producer closed.');
  }
};

Producer.prototype.destroy = function () {
  if (this._socket) {
    this._socket.destroy();
    Logger.log('Producer stopped.');
  }
};

Producer.prototype._getTimestamp = function () {
  return new Date()
    .toISOString()
    .replace(/T/, ' ')
    .replace(/\..+/, '');
};

module.exports = Producer;
