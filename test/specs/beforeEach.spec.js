'use strict';

const test = require('tape');
const Postman = require('../fixtures/postman');

test('`beforeEach` hook without any args', (t) => {
  let postman = new Postman(t);

  beforeEach();
  describe('my test suite', () => {
    it('my test', () => { });
  });

  postman.checkTests({
    '1. my test suite - my test - beforeEach #1 (this.fn is not a function)': false,
    '2. my test suite - my test': true,
  });

  t.end();
});

test('`beforeEach` hook with only a name', (t) => {
  let postman = new Postman(t);

  beforeEach('my hook');
  describe('my test suite', () => {
    it('my test', () => { });
  });

  postman.checkTests({
    '1. my test suite - my test - my hook (this.fn is not a function)': false,
    '2. my test suite - my test': true,
  });

  t.end();
});

test('`beforeEach` hook with only a function', (t) => {
  let postman = new Postman(t);
  let called = false;

  beforeEach(() => {
    called = true;
  });
  describe('my test suite', () => {
    it('my test', () => { });
  });

  t.equal(called, true);

  postman.checkTests({
    '1. my test suite - my test - beforeEach #1': true,
    '2. my test suite - my test': true,
  });

  t.end();
});

test('Error in `beforeEach` hook', (t) => {
  let postman = new Postman(t);

  beforeEach('my hook', () => {
    throw new Error('BOOM!');
  });
  describe('my test suite', () => {
    it('my test', () => { });
  });

  postman.checkTests({
    '1. my test suite - my test - my hook (BOOM!)': false,
    '2. my test suite - my test': true,
  });

  t.end();
});

test('Error in unnamed `beforeEach` hook', (t) => {
  let postman = new Postman(t);

  beforeEach(() => {
    throw new Error('BOOM!');
  });
  describe('my test suite', () => {
    it('my test', () => { });
  });

  postman.checkTests({
    '1. my test suite - my test - beforeEach #1 (BOOM!)': false,
    '2. my test suite - my test': true,
  });

  t.end();
});

test('`beforeEach` hook with successful assertions', (t) => {
  let postman = new Postman(t);
  let called = false;

  beforeEach('does some assertions', () => {
    assert(true);
    assert.equal('hello', 'hello');
    called = true;
  });
  describe('my test suite', () => {
    it('my test', () => { });
  });

  t.equal(called, true);

  postman.checkTests({
    '1. my test suite - my test - does some assertions': true,
    '2. my test suite - my test': true,
  });

  t.end();
});

test('`beforeEach` hook with failed assertions', (t) => {
  let postman = new Postman(t);

  beforeEach('my hook', () => {
    assert.ok(false);
  });
  describe('my test suite', () => {
    it('my test', () => { });
  });

  postman.checkTests({
    '1. my test suite - my test - my hook (expected false to be truthy)': false,
    '2. my test suite - my test': true,
  });

  t.end();
});

test('Passed assertions + failed `beforeEach` hook', (t) => {
  let postman = new Postman(t);

  beforeEach('my hook', () => {
    assert.ok(false);
  });
  describe('my test suite', () => {
    it('my test', () => { });
  });

  postman.checkTests({
    '1. my test suite - my test - my hook (expected false to be truthy)': false,
    '2. my test suite - my test': true,
  });

  t.end();
});

test('Failed assertions + failed `beforeEach` hook', (t) => {
  let postman = new Postman(t);

  beforeEach('my hook', () => {
    assert.ok(false);
  });
  describe('my test suite', () => {
    it('my test', () => {
      assert.equal(1, 2);
    });
  });

  postman.checkTests({
    '1. my test suite - my test - my hook (expected false to be truthy)': false,
    '2. my test suite - my test (expected 1 to equal 2)': false,
  });

  t.end();
});

test('`beforeEach` hooks run in correct order', (t) => {
  let postman = new Postman(t);
  let i = 0, testNumber = 0;

  beforeEach('my first hook', () => {
    assert.equal(++i, (testNumber * 4) + 1);
  });
  beforeEach('my second hook', () => {
    assert.equal(++i, (testNumber * 4) + 2);
  });
  beforeEach('my third hook', () => {
    assert.equal(++i, (testNumber * 4) + 3);
  });
  describe('my test suite', () => {
    it('my first test', () => {
      assert.equal(++i, 4);
      testNumber++;
    });

    it('my second test', () => {
      assert.equal(++i, 8);
      testNumber++;
    });

    it('my third test', () => {
      assert.equal(++i, 12);
    });
  });

  t.equal(i, 12);

  postman.checkTests({
    '1. my test suite - my first test - my first hook': true,
    '2. my test suite - my first test - my second hook': true,
    '3. my test suite - my first test - my third hook': true,
    '4. my test suite - my first test': true,
    '5. my test suite - my second test - my first hook': true,
    '6. my test suite - my second test - my second hook': true,
    '7. my test suite - my second test - my third hook': true,
    '8. my test suite - my second test': true,
    '9. my test suite - my third test - my first hook': true,
    '10. my test suite - my third test - my second hook': true,
    '11. my test suite - my third test - my third hook': true,
    '12. my test suite - my third test': true,
  });

  t.end();
});

test('`beforeEach` hooks run in correct order even if there are failed assertions', (t) => {
  let postman = new Postman(t);
  let i = 0;

  beforeEach('my first hook', () => {
    assert.equal(++i, 1);
  });
  beforeEach('my second hook', () => {
    assert.equal(++i, 9999);
  });
  beforeEach('my third hook', () => {
    assert.equal(++i, 3);
  });
  describe('my test suite', () => {
    it('my test', () => {
      assert.equal(++i, 4);
    });
  });

  t.equal(i, 4);

  postman.checkTests({
    '1. my test suite - my test - my first hook': true,
    '2. my test suite - my test - my second hook (expected 2 to equal 9999)': false,
    '3. my test suite - my test - my third hook': true,
    '4. my test suite - my test': true,
  });

  t.end();
});

test('`beforeEach` hooks run in correct order even if an error occurs', (t) => {
  let postman = new Postman(t);
  let i = 0;

  beforeEach('my first hook', () => {
    assert.equal(++i, 1);
  });
  beforeEach('my second hook', () => {
    assert.equal(++i, 2);
    throw new Error('BOOM');
  });
  beforeEach('my third hook', () => {
    assert.equal(++i, 3);
  });
  describe('my test suite', () => {
    it('my test', () => {
      assert.equal(++i, 4);
    });
  });

  t.equal(i, 4);

  postman.checkTests({
    '1. my test suite - my test - my first hook': true,
    '2. my test suite - my test - my second hook (BOOM)': false,
    '3. my test suite - my test - my third hook': true,
    '4. my test suite - my test': true,
  });

  t.end();
});

test('`beforeEach` hooks run even for nested tests', (t) => {
  let postman = new Postman(t);
  let i = 0, testNumber = 0;

  beforeEach('my hook', () => {
    assert.equal(++i, (testNumber * 2) + 1);
  });
  describe('my test suite', () => {
    it('my first test', () => {
      assert.equal(++i, 2);
      testNumber++;
    });

    it('my second test', () => {
      assert.equal(++i, 4);
      testNumber++;
    });

    describe(() => {
      it('my third test', () => {
        assert.equal(++i, 6);
        testNumber++;
      });

      describe(() => {
        it('my fourth test', () => {
          assert.equal(++i, 8);
          testNumber++;
        });
      });
    });

    it('my fifth test', () => {
      assert.equal(++i, 10);
    });
  });

  t.equal(i, 10);

  postman.checkTests({
    '1. my test suite - my first test - my hook': true,
    '2. my test suite - my first test': true,
    '3. my test suite - my second test - my hook': true,
    '4. my test suite - my second test': true,
    '5. my test suite - describe #2 - my third test - my hook': true,
    '6. my test suite - describe #2 - my third test': true,
    '7. my test suite - describe #2 - describe #3 - my fourth test - my hook': true,
    '8. my test suite - describe #2 - describe #3 - my fourth test': true,
    '9. my test suite - my fifth test - my hook': true,
    '10. my test suite - my fifth test': true,
  });

  t.end();
});
