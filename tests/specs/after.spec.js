var result, i;


after();   // After called with no args
result = describe('After', function() {});
result.should.deep.equal({
  'after #1': false,
  'this.fn is not a function': false
});
after.pop();


after('called without a function');
result = describe('After', function() {});
result.should.deep.equal({
  'called without a function': false,
  'this.fn is not a function': false
});
after.pop();


after('caleld with an empty function', function() {});
result = describe('After', function() {
  it('passes', function() {});
});
result.should.deep.equal({
  'After passes': true
});
after.pop();


after('throws an error', function() {
    throw new Error('BOOM!');
});
result = describe('After', function() {});
result.should.deep.equal({
  'throws an error': false,
  'BOOM!': false
});
after.pop();


after('does some assertions', function() {
  assert(true);
  assert.equal('hello', 'hello');
});
result = describe('After', function() {
  it('passes', function() {});
});
result.should.deep.equal({
  'After passes': true
});
after.pop();


after('fails an assertion', function() {
  assert.ok(0);
});
result = describe('After', function() {});
result.should.deep.equal({
  'fails an assertion': false,
  'expected 0 to be truthy': false
});
after.pop();


after('fails an assertion', function() {
  assert.ok(0);
});
result = describe('After', function() {
  it('still runs tests', function() {});
});
result.should.deep.equal({
  'After still runs tests': true,
  'fails an assertion': false,
  'expected 0 to be truthy': false,
});
after.pop();


i = 0;
after('runs first', function() {
  assert.equal(++i, 2);
});
after('runs second', function() {
  assert.equal(++i, 3);
});
after('runs third', function() {
  assert.equal(++i, 4);
});
result = describe('After', function() {
  it('runs in order', function() {
    assert.equal(++i, 1);
  });
});
result.should.deep.equal({
  'After runs in order': true
});
after.pop();
after.pop();
after.pop();


i = 0;
after('runs first', function() {
  assert.equal(++i, 2);
});
after('fails an assertion', function() {
  assert.equal(++i, 9999);
});
after('runs third', function() {
  assert.equal(++i, 4);
});
result = describe('After', function() {
  it('runs in order', function() {
    assert.equal(++i, 1);
  });
});
result.should.deep.equal({
  'After runs in order': true,
  'fails an assertion': false,
  'expected 3 to equal 9999': false,
});
after.pop();
after.pop();
after.pop();


i = 0;
after('only runs after root-level describes', function() {
  assert.equal(++i, 6);
});
result = describe('After', function() {
  it('should not have run yet', function() {
    assert.equal(++i, 1);
  });

  it('still should not have run', function() {
    assert.equal(++i, 2);
  });

  describe(function() {
    it('should not have run for a nested describe block', function() {
      assert.equal(++i, 3);
    });

    describe(function() {
      it('should not have run for this one either', function() {
        assert.equal(++i, 4);
      });
    });
  });

  it('should not run after the nested describe blocks', function() {
    assert.equal(++i, 5);
  });
});
result.should.deep.equal({
  'After should not have run yet': true,
  'After still should not have run': true,
  'After describe #2 should not have run for a nested describe block': true,
  'After describe #2 describe #3 should not have run for this one either': true,
  'After should not run after the nested describe blocks': true,
});

after.clear();
after.count().should.equal(0);

