'use strict';

function Expression(options) {
  options       = options || {};
  this.operator = options.operator || '+';
  this.integers = options.integers || this._getIntegerArray();
  this.result   = null;
}

Expression.prototype.calculate = function () {
  if (this.operator === null) {
    return false;
  }

  if (this.integers.length !== 2) {
    return false;
  }

  var self = this;
  for (var i = this.integers.length - 1; i >= 0; i--) {
    if (!self._isInt(this.integers[i])) {
      return false;
    }
  }

  switch (this.operator) {
    case '+':
      this.result = this.integers[0] + this.integers[1];
      break;
    case '-':
      this.result = this.integers[0] - this.integers[1];
      break;
    case '*':
      this.result = this.integers[0] * this.integers[1];
      break;
    case '/':
      this.result = this.integers[0] / this.integers[1];
      break;
    case '^':
      this.result = Math.pow(this.integers[0], this.integers[1]);
      break;
    default:
      return false;
  }

  return this.result;
};

Expression.prototype._getIntegerArray = function () {
  var integers = [];

  integers.push(this._getRandomInt(100, 1));
  integers.push(this._getRandomInt(100, 1));

  return integers;
};

Expression.prototype._getRandomInt = function (max, min) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

Expression.prototype._isInt = function (number) {
  return (typeof number === 'number') && (Math.floor(number) === number);
};

Expression.prototype.toString = function () {
  var string = this.integers[0] + this.operator + this.integers[1];

  if (this.result) {
    string += '=' + this.result;
  }

  return string;
};

Expression.prototype.toJSON = function () {
  return JSON.stringify({operator: this.operator, integers: this.integers, result: this.result});
};

module.exports = Expression;
