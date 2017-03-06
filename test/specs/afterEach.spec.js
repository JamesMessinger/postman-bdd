'use strict';

const test = require('tape');
const Postman = require('../fixtures/postman');

test('`afterEach` hook without any args', (t) => {
  let postman = new Postman(t);

  afterEach();
  describe('my test suite', () => {
    it('my test', () => { });
  });

  postman.checkTests({
    '1. my test suite - my test': true,
    '2. my test suite - my test - afterEach #1 (this.fn is not a function)': false,
  });

  t.end();
});

test('`afterEach` hook with only a name', (t) => {
  let postman = new Postman(t);

  afterEach('my hook');
  describe('my test suite', () => {
    it('my test', () => { });
  });

  postman.checkTests({
    '1. my test suite - my test': true,
    '2. my test suite - my test - my hook (this.fn is not a function)': false,
  });

  t.end();
});

test('`afterEach` hook with only a function', (t) => {
  let postman = new Postman(t);
  let called = false;

  afterEach(() => {
    called = true;
  });
  describe('my test suite', () => {
    it('my test', () => { });
  });

  t.equal(called, true);

  postman.checkTests({
    '1. my test suite - my test': true,
    '2. my test suite - my test - afterEach #1': true,
  });

  t.end();
});

test('Error in `afterEach` hook', (t) => {
  let postman = new Postman(t);

  afterEach('my hook', () => {
    throw new Error('BOOM!');
  });
  describe('my test suite', () => {
    it('my test', () => { });
  });

  postman.checkTests({
    '1. my test suite - my test': true,
    '2. my test suite - my test - my hook (BOOM!)': false,
  });

  t.end();
});

test('Error in unnamed `afterEach` hook', (t) => {
  let postman = new Postman(t);

  afterEach(() => {
    throw new Error('BOOM!');
  });
  describe('my test suite', () => {
    it('my test', () => { });
  });

  postman.checkTests({
    '1. my test suite - my test': true,
    '2. my test suite - my test - afterEach #1 (BOOM!)': false,
  });

  t.end();
});

test('`afterEach` hook with successful assertions', (t) => {
  let postman = new Postman(t);
  let called = false;

  afterEach('does some assertions', () => {
    assert(true);
    assert.equal('hello', 'hello');
    called = true;
  });
  describe('my test suite', () => {
    it('my test', () => { });
  });

  t.equal(called, true);

  postman.checkTests({
    '1. my test suite - my test': true,
    '2. my test suite - my test - does some assertions': true,
  });

  t.end();
});

test('`afterEach` hook with failed assertions', (t) => {
  let postman = new Postman(t);

  afterEach('my hook', () => {
    assert.ok(false);
  });
  describe('my test suite', () => {
    it('my test', () => { });
  });

  postman.checkTests({
    '1. my test suite - my test': true,
    '2. my test suite - my test - my hook (expected false to be truthy)': false,
  });

  t.end();
});

test('Passed assertions + failed `afterEach` hook', (t) => {
  let postman = new Postman(t);

  afterEach('my hook', () => {
    assert.ok(false);
  });
  describe('my test suite', () => {
    it('my test', () => { });
  });

  postman.checkTests({
    '1. my test suite - my test': true,
    '2. my test suite - my test - my hook (expected false to be truthy)': false,
  });

  t.end();
});

test('Failed assertions + failed `afterEach` hook', (t) => {
  let postman = new Postman(t);

  afterEach('my hook', () => {
    assert.ok(false);
  });
  describe('my test suite', () => {
    it('my test', () => {
      assert.equal(1, 2);
    });
  });

  postman.checkTests({
    '1. my test suite - my test (expected 1 to equal 2)': false,
    '2. my test suite - my test - my hook (expected false to be truthy)': false,
  });

  t.end();
});

test('`afterEach` hooks run in correct order', (t) => {
  let postman = new Postman(t);
  let i = 0, testNumber = 0;

  afterEach('my first hook', () => {
    assert.equal(++i, (testNumber * 4) + 2);
  });
  afterEach('my second hook', () => {
    assert.equal(++i, (testNumber * 4) + 3);
  });
  afterEach('my third hook', () => {
    assert.equal(++i, (testNumber * 4) + 4);
  });
  describe('my test suite', () => {
    it('my first test', () => {
      assert.equal(++i, 1);
    });

    it('my second test', () => {
      assert.equal(++i, 5);
      testNumber++;
    });

    it('my third test', () => {
      assert.equal(++i, 9);
      testNumber++;
    });
  });

  t.equal(i, 12);

  postman.checkTests({
    '1. my test suite - my first test': true,
    '2. my test suite - my first test - my first hook': true,
    '3. my test suite - my first test - my second hook': true,
    '4. my test suite - my first test - my third hook': true,
    '5. my test suite - my second test': true,
    '6. my test suite - my second test - my first hook': true,
    '7. my test suite - my second test - my second hook': true,
    '8. my test suite - my second test - my third hook': true,
    '9. my test suite - my third test': true,
    '10. my test suite - my third test - my first hook': true,
    '11. my test suite - my third test - my second hook': true,
    '12. my test suite - my third test - my third hook': true,
  });

  t.end();
});

test('`afterEach` hooks run in correct order even if there are failed assertions', (t) => {
  let postman = new Postman(t);
  let i = 0;

  afterEach('my first hook', () => {
    assert.equal(++i, 2);
  });
  afterEach('my second hook', () => {
    assert.equal(++i, 9999);
  });
  afterEach('my third hook', () => {
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
    '2. my test suite - my test - my first hook': true,
    '3. my test suite - my test - my second hook (expected 3 to equal 9999)': false,
    '4. my test suite - my test - my third hook': true,
  });

  t.end();
});

test('`afterEach` hooks run in correct order even if an error occurs', (t) => {
  let postman = new Postman(t);
  let i = 0;

  afterEach('my first hook', () => {
    assert.equal(++i, 2);
  });
  afterEach('my second hook', () => {
    assert.equal(++i, 3);
    throw new Error('BOOM');
  });
  afterEach('my third hook', () => {
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
    '2. my test suite - my test - my first hook': true,
    '3. my test suite - my test - my second hook (BOOM)': false,
    '4. my test suite - my test - my third hook': true,
  });

  t.end();
});

test('`afterEach` hooks run even for nested tests', (t) => {
  let postman = new Postman(t);
  let i = 0, testNumber = 0;

  afterEach('my hook', () => {
    assert.equal(++i, (testNumber * 2) + 2);
  });
  describe('my test suite', () => {
    it('my first test', () => {
      assert.equal(++i, 1);
    });

    it('my second test', () => {
      assert.equal(++i, 3);
      testNumber++;
    });

    describe(() => {
      it('my third test', () => {
        assert.equal(++i, 5);
        testNumber++;
      });

      describe(() => {
        it('my fourth test', () => {
          assert.equal(++i, 7);
          testNumber++;
        });
      });
    });

    it('my fifth test', () => {
      assert.equal(++i, 9);
      testNumber++;
    });
  });

  t.equal(i, 10);

  postman.checkTests({
    '1. my test suite - my first test': true,
    '2. my test suite - my first test - my hook': true,
    '3. my test suite - my second test': true,
    '4. my test suite - my second test - my hook': true,
    '5. my test suite - describe #2 - my third test': true,
    '6. my test suite - describe #2 - my third test - my hook': true,
    '7. my test suite - describe #2 - describe #3 - my fourth test': true,
    '8. my test suite - describe #2 - describe #3 - my fourth test - my hook': true,
    '9. my test suite - my fifth test': true,
    '10. my test suite - my fifth test - my hook': true,
  });

  t.end();
});
