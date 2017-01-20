(function () {
  'use strict';

  var result;


  result = describe('It called with no args', function () {
    it();
  });
  result.should.deep.equal({
    'It called with no args test #1': false,
    'this.fn is not a function': false
  });


  result = describe('It', function () {
    it('called without a function');
  });
  result.should.deep.equal({
    'It called without a function': false,
    'this.fn is not a function': false
  });


  result = describe('It', function () {
    it('called with empty function', function () {});
  });
  result.should.deep.equal({
    'It called with empty function': true
  });


  result = describe('It', function () {
    it('throws an error', function () {
      throw new Error('BOOM!');
    });
  });
  result.should.deep.equal({
    'It throws an error': false,
    'BOOM!': false
  });


  result = describe('It', function () {
    it('does some assertions', function () {
      assert(true);
      assert.ok(42);
      assert.equal('hello', 'hello');
      expect(new Date()).not.to.equal(new Date());
      new Date().should.be.a('Date');
    });
  });
  result.should.deep.equal({
    'It does some assertions': true
  });


  result = describe('It', function () {
    it('fails an assertion', function () {
      assert.equal('hello', 'world');
    });
  });
  result.should.deep.equal({
    'It fails an assertion': false,
    'expected \'hello\' to equal \'world\'': false,
  });


  result = describe('It', function () {
    it('does some assertions', function () {
      assert(true);
      assert.ok(42);
    });

    it('does some more assertions', function () {
      assert.equal('hello', 'world');
    });

    it(function () {
      assert(true);
    });
  });
  result.should.deep.equal({
    'It does some assertions': true,
    'It does some more assertions': false,
    'expected \'hello\' to equal \'world\'': false,
    'It test #3': true,
  });

}());
