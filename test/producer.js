'use strict';

process.env.NODE_ENV = 'test';

var Producer = require('../lib/Producer');
var chai     = require('chai');
var should   = chai.should();


describe('Producer Module', function () {

  var producer = null;

  describe('Instantiated with no arguments', function () {

    before(function () {
      producer = new Producer();
    });

    after(function () {
      producer = null;
    });

    describe('Class Instance', function () {

      it('is not null', function () {
        producer.should.not.equal(null);
      });

      it('is instance of producer class', function () {
        producer.should.be.an.instanceOf(Producer);
      });

    });

  });

});
