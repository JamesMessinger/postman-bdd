(function() {
  'use strict';

  var result, i;


  before();   // Before called with no args
  result = describe('Before', function() {});
  result.should.deep.equal({
    'before #1': false,
    'this.fn is not a function': false
  });
  before.pop();


  before('called without a function');
  result = describe('Before', function() {});
  result.should.deep.equal({
    'called without a function': false,
    'this.fn is not a function': false
  });
  before.pop();


  before('caleld with an empty function', function() {});
  result = describe('Before', function() {
    it('passes', function() {});
  });
  result.should.deep.equal({
    'Before passes': true
  });
  before.pop();


  before('throws an error', function() {
    throw new Error('BOOM!');
  });
  result = describe('Before', function() {});
  result.should.deep.equal({
    'throws an error': false,
    'BOOM!': false
  });
  before.pop();


  before('does some assertions', function() {
    assert(true);
    assert.equal('hello', 'hello');
  });
  result = describe('Before', function() {
    it('passes', function() {});
  });
  result.should.deep.equal({
    'Before passes': true
  });
  before.pop();


  before('fails an assertion', function() {
    assert.ok(0);
  });
  result = describe('Before', function() {});
  result.should.deep.equal({
    'fails an assertion': false,
    'expected 0 to be truthy': false
  });
  before.pop();


  before('fails an assertion', function() {
    assert.ok(0);
  });
  result = describe('Before', function() {
    it('still runs tests', function() {});
  });
  result.should.deep.equal({
    'fails an assertion': false,
    'expected 0 to be truthy': false,
    'Before still runs tests': true
  });
  before.pop();


  i = 0;
  before('runs first', function() {
    assert.equal(++i, 1);
  });
  before('runs second', function() {
    assert.equal(++i, 2);
  });
  before('runs third', function() {
    assert.equal(++i, 3);
  });
  result = describe('Before', function() {
    it('runs in order', function() {
      assert.equal(++i, 4);
    });
  });
  result.should.deep.equal({
    'Before runs in order': true
  });
  before.pop();
  before.pop();
  before.pop();


  i = 0;
  before('runs first', function() {
    assert.equal(++i, 1);
  });
  before('fails an assertion', function() {
    assert.equal(++i, 9999);
  });
  before('runs third', function() {
    assert.equal(++i, 3);
  });
  result = describe('Before', function() {
    it('runs in order', function() {
      assert.equal(++i, 4);
    });
  });
  result.should.deep.equal({
    'fails an assertion': false,
    'expected 2 to equal 9999': false,
    'Before runs in order': true
  });
  before.pop();
  before.pop();
  before.pop();


  i = 0;
  before('only runs before root-level describes', function() {
    assert.equal(++i, 1);
  });
  result = describe('Before', function() {
    it('should have run once', function() {
      assert.equal(++i, 2);
    });

    it('should not have run again', function() {
      assert.equal(++i, 3);
    });

    describe(function() {
      it('should not have run for a nested describe block', function() {
        assert.equal(++i, 4);
      });

      describe(function() {
        it('should not have run for this one either', function() {
          assert.equal(++i, 5);
        });
      });
    });

    it('should not run after all describe blocks', function() {
      assert.equal(++i, 6);
    });
  });
  result.should.deep.equal({
    'Before should have run once': true,
    'Before should not have run again': true,
    'Before describe #2 should not have run for a nested describe block': true,
    'Before describe #2 describe #3 should not have run for this one either': true,
    'Before should not run after all describe blocks': true,
  });

  before.clear();
  before.count().should.equal(0);

}());
