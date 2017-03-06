'use strict';

const test = require('tape');
const Postman = require('../fixtures/postman');

test('`after` hook without any args', (t) => {
  let postman = new Postman(t);

  after();
  describe('my test suite', () => { });

  postman.checkTests({
    '1. my test suite - after #1 (this.fn is not a function)': false,
  });

  t.end();
});

test('`after` hook with only a name', (t) => {
  let postman = new Postman(t);

  after('my hook');
  describe('my test suite', () => { });

  postman.checkTests({
    '1. my test suite - my hook (this.fn is not a function)': false,
  });

  t.end();
});

test('`after` hook with only a function', (t) => {
  let postman = new Postman(t);
  let called = false;

  after(() => {
    called = true;
  });
  describe('my test suite', () => {
    it('my test', () => { });
  });

  t.equal(called, true);

  postman.checkTests({
    '1. my test suite - my test': true,
    '2. my test suite - after #1': true,
  });

  t.end();
});

test('Error in `after` hook', (t) => {
  let postman = new Postman(t);

  after('my hook', () => {
    throw new Error('BOOM!');
  });
  describe('my test suite', () => { });

  postman.checkTests({
    '1. my test suite - my hook (BOOM!)': false,
  });

  t.end();
});

test('Error in unnamed `after` hook', (t) => {
  let postman = new Postman(t);

  after(() => {
    throw new Error('BOOM!');
  });
  describe('my test suite', () => { });

  postman.checkTests({
    '1. my test suite - after #1 (BOOM!)': false,
  });

  t.end();
});

test('`after` hook with successful assertions', (t) => {
  let postman = new Postman(t);
  let called = false;

  after('my hook', () => {
    assert(true);
    assert.equal('hello', 'hello');
    called = true;
  });
  describe('my test suite', () => { });

  t.equal(called, true);

  postman.checkTests({
    '1. my test suite - my hook': true,
  });

  t.end();
});

test('`after` hook with failed assertions', (t) => {
  let postman = new Postman(t);

  after('my hook', () => {
    assert.ok(false);
  });
  describe('my test suite', () => { });

  postman.checkTests({
    '1. my test suite - my hook (expected false to be truthy)': false,
  });

  t.end();
});

test('Passed assertions + failed `after` hook', (t) => {
  let postman = new Postman(t);

  after('my hook', () => {
    assert.ok(false);
  });
  describe('my test suite', () => {
    it('my test', () => { });
  });

  postman.checkTests({
    '1. my test suite - my test': true,
    '2. my test suite - my hook (expected false to be truthy)': false,
  });

  t.end();
});

test('Failed assertions + failed `after` hook', (t) => {
  let postman = new Postman(t);

  after('my hook', () => {
    assert.ok(false);
  });
  describe('my test suite', () => {
    it('my test', () => {
      assert.equal(1, 2);
    });
  });

  postman.checkTests({
    '1. my test suite - my test (expected 1 to equal 2)': false,
    '2. my test suite - my hook (expected false to be truthy)': false,
  });

  t.end();
});

test('`after` hooks run in correct order', (t) => {
  let postman = new Postman(t);
  let i = 0;

  after('my first hook', () => {
    assert.equal(++i, 2);
  });
  after('my second hook', () => {
    assert.equal(++i, 3);
  });
  after('my third hook', () => {
    assert.equal(++i, 4);
  });
  describe('my test suite', () => {
    it('my test', () => {
      assert.equal(++i, 1);
    });
  });

  t.equal(i, 4);

  postman.checkTests({
    '1. my test suite - my test': true,
    '2. my test suite - my first hook': true,
    '3. my test suite - my second hook': true,
    '4. my test suite - my third hook': true,
  });

  t.end();
});

test('`after` hooks run in correct order even if there are failed assertions', (t) => {
  let postman = new Postman(t);
  let i = 0;

  after('my first hook', () => {
    assert.equal(++i, 2);
  });
  after('my second hook', () => {
    assert.equal(++i, 9999);
  });
  after('my third hook', () => {
    assert.equal(++i, 4);
  });
  describe('my test suite', () => {
    it('my test', () => {
      assert.equal(++i, 1);
    });
  });

  t.equal(i, 4);

  postman.checkTests({
    '1. my test suite - my test': true,
    '2. my test suite - my first hook': true,
    '3. my test suite - my second hook (expected 3 to equal 9999)': false,
    '4. my test suite - my third hook': true,
  });

  t.end();
});

test('`after` hooks run in correct order even if an error occurs', (t) => {
  let postman = new Postman(t);
  let i = 0;

  after('my first hook', () => {
    assert.equal(++i, 2);
  });
  after('my second hook', () => {
    assert.equal(++i, 3);
    throw new Error('BOOM');
  });
  after('my third hook', () => {
    assert.equal(++i, 4);
  });
  describe('my test suite', () => {
    it('my test', () => {
      assert.equal(++i, 1);
    });
  });

  t.equal(i, 4);

  postman.checkTests({
    '1. my test suite - my test': true,
    '2. my test suite - my first hook': true,
    '3. my test suite - my second hook (BOOM)': false,
    '4. my test suite - my third hook': true,
  });

  t.end();
});

test('`after` hooks only run after top-level describe blocks', (t) => {
  let postman = new Postman(t);
  let i = 0;

  after('my hook', () => {
    assert.equal(++i, 7);
  });

  // The `after` hook will run after this describe block
  describe('my test suite', () => {
    it('my first test', () => {
      assert.equal(++i, 1);
    });

    it('my second test', () => {
      assert.equal(++i, 2);
    });

    // The `after` hook will NOT run after this describe block
    describe(() => {
      it('my third test', () => {
        assert.equal(++i, 3);
      });

      // The `after` hook will NOT run after this describe block
      describe(() => {
        it('my fourth test', () => {
          assert.equal(++i, 4);
        });
      });

      it('my fifth test', () => {
        assert.equal(++i, 5);
      });
    });

    it('my sixth test', () => {
      assert.equal(++i, 6);
    });
  });

  t.equal(i, 7);

  postman.checkTests({
    '1. my test suite - my first test': true,
    '2. my test suite - my second test': true,
    '3. my test suite - describe #2 - my third test': true,
    '4. my test suite - describe #2 - describe #3 - my fourth test': true,
    '5. my test suite - describe #2 - my fifth test': true,
    '6. my test suite - my sixth test': true,
    '7. my test suite - my hook': true,
  });

  t.end();
});
