(function() {
  'use strict';

  var result, i;


  afterEach();   // AfterEach called with no args
  result = describe('AfterEach', function() {
    it('passes', function() {});
  });
  result.should.deep.equal({
    'AfterEach passes': true,
    'AfterEach afterEach #1': false,
    'this.fn is not a function': false,
  });
  afterEach.pop();


  afterEach('called without a function');
  result = describe('AfterEach', function() {
    it('passes', function() {});
  });
  result.should.deep.equal({
    'AfterEach passes': true,
    'AfterEach called without a function': false,
    'this.fn is not a function': false,
  });
  afterEach.pop();


  afterEach('caleld with an empty function', function() {});
  result = describe('AfterEach', function() {
    it('passes', function() {});
  });
  result.should.deep.equal({
    'AfterEach passes': true
  });
  afterEach.pop();


  afterEach('throws an error', function() {
    throw new Error('BOOM!');
  });
  result = describe('AfterEach', function() {
    it('passes', function() {});
  });
  result.should.deep.equal({
    'AfterEach passes': true,
    'AfterEach throws an error': false,
    'BOOM!': false,
  });
  afterEach.pop();


  afterEach('does some assertions', function() {
    assert(true);
    assert.equal('hello', 'hello');
  });
  result = describe('AfterEach', function() {
    it('passes', function() {});
  });
  result.should.deep.equal({
    'AfterEach passes': true
  });
  afterEach.pop();


  afterEach('fails an assertion', function() {
    assert.ok(0);
  });
  result = describe('AfterEach', function() {
    it('still runs tests', function() {});
  });
  result.should.deep.equal({
    'AfterEach still runs tests': true,
    'AfterEach fails an assertion': false,
    'expected 0 to be truthy': false,
  });
  afterEach.pop();


  i = 0;
  afterEach('runs first', function() {
    assert.equal(++i, 2);
  });
  afterEach('runs second', function() {
    assert.equal(++i, 3);
  });
  afterEach('runs third', function() {
    assert.equal(++i, 4);
  });
  result = describe('AfterEach', function() {
    it('runs in order', function() {
      assert.equal(++i, 1);
    });

    it('runs after each test', function() {
      i = 0;
      assert.equal(++i, 9999);
    });

    it('runs even after a test fails', function() {
      assert.equal(++i, 5);
      i = 1;
    });
  });
  result.should.deep.equal({
    'AfterEach runs in order': true,
    'AfterEach runs after each test': false,
    'expected 1 to equal 9999': false,
    'AfterEach runs even after a test fails': true,
  });
  afterEach.pop();
  afterEach.pop();
  afterEach.pop();


  i = 0;
  afterEach('runs first', function() {
    assert.equal(++i, 2);
  });
  afterEach('fails an assertion', function() {
    assert.equal(++i, 9999);
  });
  afterEach('runs third', function() {
    assert.equal(++i, 4);
  });
  result = describe('AfterEach', function() {
    it('runs in order', function() {
      assert.equal(++i, 1);
    });
  });
  result.should.deep.equal({
    'AfterEach runs in order': true,
    'AfterEach fails an assertion': false,
    'expected 3 to equal 9999': false,
  });
  afterEach.pop();
  afterEach.pop();
  afterEach.pop();


  i = 0;
  afterEach('runs after each test', function() {
    assert.equal(++i % 2, 0);
  });
  result = describe('AfterEach', function() {
    it('should run once', function() {
      assert.equal(++i, 1);
    });

    it('should run again', function() {
      assert.equal(++i, 3);
    });

    describe(function() {
      it('should run for a test in a nested describe block', function() {
        assert.equal(++i, 5);
      });

      describe(function() {
        it('should run for this one too', function() {
          assert.equal(++i, 7);
        });
      });
    });

    it('should run for this test as well', function() {
      assert.equal(++i, 9);
    });
  });
  result.should.deep.equal({
    'AfterEach should run once': true,
    'AfterEach should run again': true,
    'AfterEach describe #2 should run for a test in a nested describe block': true,
    'AfterEach describe #2 describe #3 should run for this one too': true,
    'AfterEach should run for this test as well': true
  });

  afterEach.clear();
  afterEach.count().should.equal(0);

}());
