'use strict';

function Logger() {

}

Logger.prototype.log = function (msg) {
  if (process.env.NODE_ENV !== 'test') {
    console.log(msg);
  }
};

module.exports = new Logger;
