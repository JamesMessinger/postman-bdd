'use strict';

const test = require('tape');
const Postman = require('../fixtures/postman');

test('`after` hook without any args', (t) => {
  let postman = new Postman(t);

  after();
  describe('my test suite', () => { });

  postman.checkTests({
    'after #1': false,
    'this.fn is not a function': false
  });

  t.end();
});

test('`after` hook with only a name', (t) => {
  let postman = new Postman(t);

  after('my hook');
  describe('my test suite', () => { });

  postman.checkTests({
    'my hook': false,
    'this.fn is not a function': false
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
    'my test suite my test': true
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
    'my hook': false,
    'BOOM!': false
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
    'after #1': false,
    'BOOM!': false
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

  postman.checkTests({});

  t.end();
});

test('`after` hook with failed assertions', (t) => {
  let postman = new Postman(t);

  after('my hook', () => {
    assert.ok(false);
  });
  describe('my test suite', () => { });

  postman.checkTests({
    'my hook': false,
    'expected false to be truthy': false,
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
    'my test suite my test': true,
    'my hook': false,
    'expected false to be truthy': false,
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
    'my test suite my test': false,
    'expected 1 to equal 2': false,
    'my hook': false,
    'expected false to be truthy': false,
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
    'my test suite my test': true
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
    'my test suite my test': true,
    'my second hook': false,
    'expected 3 to equal 9999': false,
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
    'my test suite my test': true,
    'my second hook': false,
    BOOM: false,
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
    'my test suite my first test': true,
    'my test suite my second test': true,
    'my test suite describe #2 my third test': true,
    'my test suite describe #2 describe #3 my fourth test': true,
    'my test suite describe #2 my fifth test': true,
    'my test suite my sixth test': true,
  });

  t.end();
});
