'use strict';

process.env.NODE_ENV = 'test';

var Expression = require('../lib/Expression');
var chai       = require('chai');
var should     = chai.should();

chai.use(require('chai3-json-schema'));


describe('Expression Module', function () {

  var expression = null;

  describe('Instantiated with no arguments', function () {

    before(function () {
      expression = new Expression();
    });

    after(function () {
      expression = null;
    });

    describe('Class Instance', function () {

      it('is not null', function () {
        expression.should.not.equal(null);
      });

      it('is instance of Expression class', function () {
        expression.should.be.an.instanceOf(Expression);
      });

    });

    describe('toString()', function () {

      it('returns a string', function () {
        var string = expression.toString();
        string.should.be.a('string');
      });

    });

    describe('toJSON()', function () {

      it('returns a string', function () {
        var data = expression.toJSON();
        data.should.be.a('string');
      });

      it('parses into valid JSON data', function () {
        var data = JSON.parse(expression.toJSON());
        var expressionSchema = {
          "title": "expression schema",
          "type": "object",
          "required": ["operator", "integers", "result"],
          "properties": {
            "operator": {
              "type": "string"
            },
            "integers": {
              "type": "array",
              "minItems": 2,
              "uniqueItems": false,
              "items": {
                "type": "integer",
                "minimum": 1
              }
            },
            "result": {
              "type": ["integer", "null"],
              "minimum": 1
            }
          }
        };
        data.should.be.jsonSchema(expressionSchema);
      });

    });

    describe('calculate()', function () {

      it('returns an integer', function () {
        var result = expression.calculate();
        result.should.be.a('number').and.equal(Math.floor(result));
      });

    });

    describe('_getIntegerArray()', function () {

      it('returns an array of integers', function () {
        var integers = expression._getIntegerArray();
        integers.should.be.an('array');
        for (var i = integers.length - 1; i >= 0; i--) {
          integers[i].should.be.a('number').and.equal(Math.floor(integers[i]));
        }
      });

    });

    describe('_getRandomInt()', function () {

      it('returns a random integer', function () {
        var integer = expression._getRandomInt(100, 1);
        integer.should.be.a('number').and.equal(Math.floor(integer));
      });

    });

    describe('_isInt()', function () {

      it('returns true for 5', function () {
        var good = expression._isInt(5);
        good.should.equal(true);
      });

      it('returns false for .12', function () {
        var bad = expression._isInt(.12);
        bad.should.equal(false);
      });

    });

  });

  describe('Instantiated with options argument', function () {

    before(function () {
      expression = new Expression({operator: '-', integers: [9, 5]});
    });

    after(function () {
      expression = null;
    });

    describe('Class Instance', function () {

      it('is not null', function () {
        expression.should.not.equal(null);
      });

      it('is instance of Expression class', function () {
        expression.should.be.an.instanceOf(Expression);
      });

    });

    describe('toString()', function () {

      it('returns a string', function () {
        var string = expression.toString();
        string.should.be.a('string');
      });

    });

    describe('toJSON()', function () {

      it('returns a string', function () {
        var data = expression.toJSON();
        data.should.be.a('string');
      });

      it('parses into valid JSON data', function () {
        var data = JSON.parse(expression.toJSON());
        var expressionSchema = {
          "title": "expression schema",
          "type": "object",
          "required": ["operator", "integers", "result"],
          "properties": {
            "operator": {
              "type": "string"
            },
            "integers": {
              "type": "array",
              "minItems": 2,
              "uniqueItems": false,
              "items": {
                "type": "integer",
                "minimum": 1
              }
            },
            "result": {
              "type": ["integer", "null"],
              "minimum": 1
            }
          }
        };
        data.should.be.jsonSchema(expressionSchema);
      });

    });

    describe('calculate()', function () {

      it('returns a correct result', function () {
        var result = expression.calculate();
        result.should.equal(4);
      });

    });

  });

});
