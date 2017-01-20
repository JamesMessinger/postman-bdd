(function () {
  'use strict';

  var result, i;


  beforeEach();   // BeforeEach called with no args
  result = describe('BeforeEach', function () {
    it('passes', function () {});
  });
  result.should.deep.equal({
    'BeforeEach beforeEach #1': false,
    'this.fn is not a function': false,
    'BeforeEach passes': true
  });
  beforeEach.pop();


  beforeEach('called without a function');
  result = describe('BeforeEach', function () {
    it('passes', function () {});
  });
  result.should.deep.equal({
    'BeforeEach called without a function': false,
    'this.fn is not a function': false,
    'BeforeEach passes': true,
  });
  beforeEach.pop();


  beforeEach('caleld with an empty function', function () {});
  result = describe('BeforeEach', function () {
    it('passes', function () {});
  });
  result.should.deep.equal({
    'BeforeEach passes': true
  });
  beforeEach.pop();


  beforeEach('throws an error', function () {
    throw new Error('BOOM!');
  });
  result = describe('BeforeEach', function () {
    it('passes', function () {});
  });
  result.should.deep.equal({
    'BeforeEach throws an error': false,
    'BOOM!': false,
    'BeforeEach passes': true,
  });
  beforeEach.pop();


  beforeEach('does some assertions', function () {
    assert(true);
    assert.equal('hello', 'hello');
  });
  result = describe('BeforeEach', function () {
    it('passes', function () {});
  });
  result.should.deep.equal({
    'BeforeEach passes': true
  });
  beforeEach.pop();


  beforeEach('fails an assertion', function () {
    assert.ok(0);
  });
  result = describe('BeforeEach', function () {
    it('still runs tests', function () {});
  });
  result.should.deep.equal({
    'BeforeEach fails an assertion': false,
    'expected 0 to be truthy': false,
    'BeforeEach still runs tests': true,
  });
  beforeEach.pop();


  i = 0;
  beforeEach('runs first', function () {
    assert.equal(++i, 1);
  });
  beforeEach('runs second', function () {
    assert.equal(++i, 2);
  });
  beforeEach('runs third', function () {
    assert.equal(++i, 3);
  });
  result = describe('BeforeEach', function () {
    it('runs in order', function () {
      assert.equal(++i, 4);
      i = 0;
    });

    it('runs before each test', function () {
      i = 0;
      assert.equal(i, 9999);
    });

    it('runs even after a test fails', function () {
      assert.equal(++i, 4);
    });
  });
  result.should.deep.equal({
    'BeforeEach runs in order': true,
    'BeforeEach runs before each test': false,
    'expected 0 to equal 9999': false,
    'BeforeEach runs even after a test fails': true,
  });
  beforeEach.pop();
  beforeEach.pop();
  beforeEach.pop();


  i = 0;
  beforeEach('runs first', function () {
    assert.equal(++i, 1);
  });
  beforeEach('fails an assertion', function () {
    assert.equal(++i, 9999);
  });
  beforeEach('runs third', function () {
    assert.equal(++i, 3);
  });
  result = describe('BeforeEach', function () {
    it('runs in order', function () {
      assert.equal(++i, 4);
    });
  });
  result.should.deep.equal({
    'BeforeEach fails an assertion': false,
    'expected 2 to equal 9999': false,
    'BeforeEach runs in order': true
  });
  beforeEach.pop();
  beforeEach.pop();
  beforeEach.pop();


  i = 0;
  beforeEach('runs before each test', function () {
    assert.equal(++i % 2, 1);
  });
  result = describe('BeforeEach', function () {
    it('should have run once', function () {
      assert.equal(++i, 2);
    });

    it('should have run again', function () {
      assert.equal(++i, 4);
    });

    describe(function () {
      it('should have run for a test in a nested describe block', function () {
        assert.equal(++i, 6);
      });

      describe(function () {
        it('should have run for this one too', function () {
          assert.equal(++i, 8);
        });
      });
    });

    it('should have run for this test as well', function () {
      assert.equal(++i, 10);
    });
  });
  result.should.deep.equal({
    'BeforeEach should have run once': true,
    'BeforeEach should have run again': true,
    'BeforeEach describe #2 should have run for a test in a nested describe block': true,
    'BeforeEach describe #2 describe #3 should have run for this one too': true,
    'BeforeEach should have run for this test as well': true
  });

  beforeEach.clear();
  beforeEach.count().should.equal(0);

}());
