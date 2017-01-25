'use strict';

const test = require('tape');
const Postman = require('../fixtures/postman');

test('`it` without any args', (t) => {
  let postman = new Postman(t);

  describe('my test suite', () => {
    it();
  });

  postman.checkTests({
    'my test suite test #1': false,
    'this.fn is not a function': false
  });

  t.end();
});

test('`it` with only a name', (t) => {
  let postman = new Postman(t);

  describe('my test suite', () => {
    it('my test');
  });

  postman.checkTests({
    'my test suite my test': false,
    'this.fn is not a function': false
  });

  t.end();
});

test('`it` with only a function', (t) => {
  let postman = new Postman(t);

  describe('my test suite', () => {
    it(() => { });
  });

  postman.checkTests({
    'my test suite test #1': true
  });

  t.end();
});

test('`it` outside of `describe` block', (t) => {
  let postman = new Postman(t);
  let i = 0;

  it('my first test', () => {
    assert.equal(++i, 1);
  });

  describe('my test suite', () => {
    it('my second test', () => {
      assert.equal(++i, 2);
    });
  });

  it('my third test', () => {
    assert.equal(++i, 3);
  });

  t.equal(i, 3);

  postman.checkTests({
    'my first test': true,
    'my test suite my second test': true,
    'my third test': true,
  });

  t.end();
});

test('Error in `it`', (t) => {
  let postman = new Postman(t);

  describe('my test suite', () => {
    it('my test', () => {
      throw new Error('BOOM!');
    });
  });

  postman.checkTests({
    'my test suite my test': false,
    'BOOM!': false
  });

  t.end();
});

test('Error in unnamed `it`', (t) => {
  let postman = new Postman(t);

  describe('my test suite', () => {
    it(() => {
      throw new Error('BOOM!');
    });
  });

  postman.checkTests({
    'my test suite test #1': false,
    'BOOM!': false
  });

  t.end();
});

test('`it` with successful assertions', (t) => {
  let postman = new Postman(t);

  describe('my test suite', () => {
    it('my test', () => {
      assert(true);
      assert.ok(42);
      assert.equal('hello', 'hello');
      expect(new Date()).not.to.equal(new Date());
      new Date().should.be.a('Date');
    });
  });

  postman.checkTests({
    'my test suite my test': true
  });

  t.end();
});

test('`it` with failed assertions', (t) => {
  let postman = new Postman(t);

  describe('my test suite', () => {
    it('my test', () => {
      assert.equal('hello', 'world');
    });
  });

  postman.checkTests({
    'my test suite my test': false,
    'expected \'hello\' to equal \'world\'': false,
  });

  t.end();
});

test('`it` runs in the corret order', (t) => {
  let postman = new Postman(t);
  let i = 0;

  describe('my test suite', () => {
    it('my first test', () => {
      assert.equal(++i, 1);
    });

    it('my second test', () => {
      assert.equal(++i, 2);
    });

    it('my third test', () => {
      assert.equal(++i, 3);
    });
  });

  t.equal(i, 3);

  postman.checkTests({
    'my test suite my first test': true,
    'my test suite my second test': true,
    'my test suite my third test': true,
  });

  t.end();
});

test('`it` runs in the corret order even if there are failed assertions', (t) => {
  let postman = new Postman(t);
  let i = 0;

  describe('my test suite', () => {
    it('my first test', () => {
      assert.equal(++i, 1);
    });

    it('my second test', () => {
      assert.equal(++i, 9999);
    });

    it('my third test', () => {
      assert.equal(++i, 3);
    });
  });

  t.equal(i, 3);

  postman.checkTests({
    'my test suite my first test': true,
    'my test suite my second test': false,
    'expected 2 to equal 9999': false,
    'my test suite my third test': true,
  });

  t.end();
});

test('`it` runs in the corret order even if an error occurs', (t) => {
  let postman = new Postman(t);
  let i = 0;

  describe('my test suite', () => {
    it('my first test', () => {
      assert.equal(++i, 1);
    });

    it('my second test', () => {
      assert.equal(++i, 2);
      throw new Error('BOOM');
    });

    it('my third test', () => {
      assert.equal(++i, 3);
    });
  });

  t.equal(i, 3);

  postman.checkTests({
    'my test suite my first test': true,
    'my test suite my second test': false,
    BOOM: false,
    'my test suite my third test': true,
  });

  t.end();
});

test('`it` can be nested', (t) => {
  let postman = new Postman(t);
  let i = 0;

  it('my first test', () => {
    assert.equal(++i, 1);
  });

  describe('my test suite', () => {
    it('my second test', () => {
      assert.equal(++i, 2);
    });

    describe(() => {
      it('my third test', () => {
        assert.equal(++i, 3);
      });

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

  it('my seventh test', () => {
    assert.equal(++i, 7);
  });

  t.equal(i, 7);

  postman.checkTests({
    'my first test': true,
    'my test suite my second test': true,
    'my test suite describe #2 my third test': true,
    'my test suite describe #2 describe #3 my fourth test': true,
    'my test suite describe #2 my fifth test': true,
    'my test suite my sixth test': true,
    'my seventh test': true,
  });

  t.end();
});
