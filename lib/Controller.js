'use strict';

var Consumer = require('./Consumer');
var Producer = require('./Producer');
var Logger   = require('./Logger');

function Controller() {
  this.timeout    = process.argv[2] || 0;
  this._consumer  = null;
  this._producers = [];

  this.start();
}

Controller.prototype.start = function () {
  Logger.log('Starting...');

  var runtime = process.argv[2] || 0;

  this._consumer = new Consumer();

  if (this._consumer._server) {
    var self = this;

    this._consumer._server
      .on('listening', function () {
        var port = self._consumer.getPort();
        var host = self._consumer.getHost();

        self._producers.push(new Producer({port: port, host: host}));
        self._producers.push(new Producer({port: port, host: host}));

        if (self.timeout) {
          setTimeout(function () {
            Logger.log('Stopping...');

            for (var i = self._producers.length - 1; i >= 0; i--) {
              self._producers[i].destroy();
            }

            self._consumer.close();
          }, runtime);
        }
      })
      .on('close', function () {
        Logger.log('Goodbye.');
        process.exit();
      });
  } else {
    throw new Error('Consumer could not be started');
  }
};

module.exports = Controller;

