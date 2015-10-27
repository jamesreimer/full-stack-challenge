'use strict';

process.env.NODE_ENV = 'test';

var Consumer = require('../lib/Consumer');
var chai     = require('chai');
var should   = chai.should();
var net      = require('net');


describe('Consumer Module', function () {

  var consumer = null;
  var port     = null;
  var host     = null;

  describe('Instantiated with no arguments', function () {

    before(function () {
      consumer = new Consumer();
    });

    after(function () {
      consumer = null;
    });

    describe('Class Instance', function () {

      it('is not null', function () {
        consumer.should.not.equal(null);
      });

      it('is instance of Consumer class', function () {
        consumer.should.be.an.instanceOf(Consumer);
      });

    });

    describe('Server', function () {

      it('is running', function () {
        port = consumer.getPort();
        host = consumer.getHost();

        port.should.be.a('number');
        host.should.be.a('string');
      });

      it('returns solved expression', function (done) {
        var socket = net
          .createConnection(port, host)
          .setEncoding('utf8')
          .on('connect', function () {
            socket.write(JSON.stringify({operator: '+', integers: [2, 6]}));
          })
          .on('data', function (data) {
            data = JSON.parse(data);

            var result = data.integers[0] + data.operator + data.integers[1] + '=' + data.result;

            result.should.equal('2+6=8');
            done();
          });
      });

    });

  });

});
