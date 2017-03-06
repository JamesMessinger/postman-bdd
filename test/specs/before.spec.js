'use strict';

const test = require('tape');
const Postman = require('../fixtures/postman');

test('`before` hook without any args', (t) => {
  let postman = new Postman(t);

  before();
  describe('my test suite', () => { });

  postman.checkTests({
    '1. my test suite - before #1 (this.fn is not a function)': false,
  });

  t.end();
});

test('`before` hook with only a name', (t) => {
  let postman = new Postman(t);

  before('my hook');
  describe('my test suite', () => { });

  postman.checkTests({
    '1. my test suite - my hook (this.fn is not a function)': false,
  });

  t.end();
});

test('`before` hook with only a function', (t) => {
  let postman = new Postman(t);
  let called = false;

  before('my hook', () => {
    called = true;
  });
  describe('my test suite', () => {
    it('my test', () => { });
  });

  t.equal(called, true);

  postman.checkTests({
    '1. my test suite - my hook': true,
    '2. my test suite - my test': true,
  });

  t.end();
});

test('Error in `before` hook', (t) => {
  let postman = new Postman(t);

  before('my hook', () => {
    throw new Error('BOOM!');
  });
  describe('my test suite', () => { });

  postman.checkTests({
    '1. my test suite - my hook (BOOM!)': false,
  });

  t.end();
});

test('Error in unnamed `before` hook', (t) => {
  let postman = new Postman(t);

  before(() => {
    throw new Error('BOOM!');
  });
  describe('my test suite', () => { });

  postman.checkTests({
    '1. my test suite - before #1 (BOOM!)': false,
  });

  t.end();
});

test('`before` hook with successful assertions', (t) => {
  let postman = new Postman(t);
  let called = false;

  before('my hook', () => {
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

test('`before` hook with failed assertions', (t) => {
  let postman = new Postman(t);

  before('my hook', () => {
    assert.ok(false);
  });
  describe('my test suite', () => { });

  postman.checkTests({
    '1. my test suite - my hook (expected false to be truthy)': false,
  });

  t.end();
});

test('Passed assertions + failed `before` hook', (t) => {
  let postman = new Postman(t);

  before('my hook', () => {
    assert.ok(false);
  });
  describe('my test suite', () => {
    it('my test', () => { });
  });

  postman.checkTests({
    '1. my test suite - my hook (expected false to be truthy)': false,
    '2. my test suite - my test': true,
  });

  t.end();
});

test('Failed assertions + failed `before` hook', (t) => {
  let postman = new Postman(t);

  before('my hook', () => {
    assert.ok(false);
  });
  describe('my test suite', () => {
    it('my test', () => {
      assert.equal(1, 2);
    });
  });

  postman.checkTests({
    '1. my test suite - my hook (expected false to be truthy)': false,
    '2. my test suite - my test (expected 1 to equal 2)': false,
  });

  t.end();
});

test('`before` hooks run in correct order', (t) => {
  let postman = new Postman(t);
  let i = 0;

  before('my first hook', () => {
    assert.equal(++i, 1);
  });
  before('my second hook', () => {
    assert.equal(++i, 2);
  });
  before('my third hook', () => {
    assert.equal(++i, 3);
  });
  describe('my test suite', () => {
    it('my test', () => {
      assert.equal(++i, 4);
    });
  });

  t.equal(i, 4);

  postman.checkTests({
    '1. my test suite - my first hook': true,
    '2. my test suite - my second hook': true,
    '3. my test suite - my third hook': true,
    '4. my test suite - my test': true,
  });

  t.end();
});

test('`before` hooks run in correct order even if there are failed assertions', (t) => {
  let postman = new Postman(t);
  let i = 0;

  before('my first hook', () => {
    assert.equal(++i, 1);
  });
  before('my second hook', () => {
    assert.equal(++i, 9999);
  });
  before('my third hook', () => {
    assert.equal(++i, 3);
  });
  describe('my test suite', () => {
    it('my test', () => {
      assert.equal(++i, 4);
    });
  });

  t.equal(i, 4);

  postman.checkTests({
    '1. my test suite - my first hook': true,
    '2. my test suite - my second hook (expected 2 to equal 9999)': false,
    '3. my test suite - my third hook': true,
    '4. my test suite - my test': true,
  });

  t.end();
});

test('`before` hooks run in correct order even if an error occurs', (t) => {
  let postman = new Postman(t);
  let i = 0;

  before('my first hook', () => {
    assert.equal(++i, 1);
  });
  before('my second hook', () => {
    assert.equal(++i, 2);
    throw new Error('BOOM');
  });
  before('my third hook', () => {
    assert.equal(++i, 3);
  });
  describe('my test suite', () => {
    it('my test', () => {
      assert.equal(++i, 4);
    });
  });

  t.equal(i, 4);

  postman.checkTests({
    '1. my test suite - my first hook': true,
    '2. my test suite - my second hook (BOOM)': false,
    '3. my test suite - my third hook': true,
    '4. my test suite - my test': true,
  });

  t.end();
});

test('`before` hooks only run before top-level describe blocks', (t) => {
  let postman = new Postman(t);
  let i = 0;

  before('my hook', () => {
    assert.equal(++i, 1);
  });

  // The `before` hook will run before this describe block
  describe('my test suite', () => {
    it('my first test', () => {
      assert.equal(++i, 2);
    });

    it('my second test', () => {
      assert.equal(++i, 3);
    });

    // The `before` hook will NOT run before this describe block
    describe(() => {
      it('my third test', () => {
        assert.equal(++i, 4);
      });

      // The `before` hook will NOT run before this describe block
      describe(() => {
        it('my fourth test', () => {
          assert.equal(++i, 5);
        });
      });

      it('my fifth test', () => {
        assert.equal(++i, 6);
      });
    });

    it('my sixth test', () => {
      assert.equal(++i, 7);
    });
  });

  t.equal(i, 7);

  postman.checkTests({
    '1. my test suite - my hook': true,
    '2. my test suite - my first test': true,
    '3. my test suite - my second test': true,
    '4. my test suite - describe #2 - my third test': true,
    '5. my test suite - describe #2 - describe #3 - my fourth test': true,
    '6. my test suite - describe #2 - my fifth test': true,
    '7. my test suite - my sixth test': true,
  });

  t.end();
});
