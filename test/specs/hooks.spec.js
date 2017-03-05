'use strict';

const test = require('tape');
const Postman = require('../fixtures/postman');

test('Hooks run in the correct order', (t) => {
  let postman = new Postman(t);
  let i = 0, testNumber = 0;

  before(() => {
    assert.equal(++i, 1);
  });
  before(() => {
    assert.equal(++i, 2);
  });

  beforeEach(() => {
    assert.equal(++i, (testNumber * 5) + 3);
  });
  beforeEach(() => {
    assert.equal(++i, (testNumber * 5) + 4);
  });

  afterEach(() => {
    assert.equal(++i, (testNumber * 5) + 1);
  });
  afterEach('my third hook', () => {
    assert.equal(++i, (testNumber * 5) + 2);
  });

  after(() => {
    assert.equal(++i, 28);
  });
  after(() => {
    assert.equal(++i, 29);
  });

  describe(() => {
    it(() => {
      testNumber++;
      assert.equal(++i, 5);
    });

    describe(() => {
      it(() => {
        testNumber++;
        assert.equal(++i, 10);
      });

      describe(() => {
        it(() => {
          testNumber++;
          assert.equal(++i, 15);
        });
      });

      it(() => {
        testNumber++;
        assert.equal(++i, 20);
      });
    });

    it(() => {
      testNumber++;
      assert.equal(++i, 25);
    });
  });

  t.equal(i, 29);

  postman.checkTests({
    'describe #1 test #1': true,
    'describe #1 describe #2 test #2': true,
    'describe #1 describe #2 describe #3 test #3': true,
    'describe #1 describe #2 test #4': true,
    'describe #1 test #5': true,
  });

  t.end();
});

test('Hooks run in the correct order even if there are failed assertions', (t) => {
  let postman = new Postman(t);
  let i = 0, testNumber = 0;

  before(() => {
    assert.equal(++i, 9999);
  });
  before(() => {
    assert.equal(++i, 2);
  });

  beforeEach(() => {
    assert.equal(++i, 9999);
  });
  beforeEach(() => {
    assert.equal(++i, (testNumber * 5) + 4);
  });

  afterEach(() => {
    assert.equal(++i, 9999);
  });
  afterEach('my third hook', () => {
    assert.equal(++i, (testNumber * 5) + 2);
  });

  after(() => {
    assert.equal(++i, 9999);
  });
  after(() => {
    assert.equal(++i, 29);
  });

  describe(() => {
    it(() => {
      testNumber++;
      assert.equal(++i, 5);
    });

    describe(() => {
      it(() => {
        testNumber++;
        assert.equal(++i, 10);
      });

      describe(() => {
        it(() => {
          testNumber++;
          assert.equal(++i, 15);
        });
      });

      it(() => {
        testNumber++;
        assert.equal(++i, 20);
      });
    });

    it(() => {
      testNumber++;
      assert.equal(++i, 25);
    });
  });

  t.equal(i, 29);

  postman.checkTests({
    'before #1 (expected 1 to equal 9999)': false,
    'describe #1 beforeEach #1 (expected 3 to equal 9999)': false,
    'describe #1 test #1': true,
    'describe #1 afterEach #1 (expected 6 to equal 9999)': false,

    'describe #1 describe #2 beforeEach #1 (expected 8 to equal 9999)': false,
    'describe #1 describe #2 test #2': true,
    'describe #1 describe #2 afterEach #1 (expected 11 to equal 9999)': false,

    'describe #1 describe #2 describe #3 beforeEach #1 (expected 13 to equal 9999)': false,
    'describe #1 describe #2 describe #3 test #3': true,
    'describe #1 describe #2 describe #3 afterEach #1 (expected 16 to equal 9999)': false,

    'describe #1 describe #2 beforeEach #1 (expected 18 to equal 9999)': false,
    'describe #1 describe #2 test #4': true,
    'describe #1 describe #2 afterEach #1 (expected 21 to equal 9999)': false,
    'describe #1 beforeEach #1 (expected 23 to equal 9999)': false,
    'describe #1 test #5': true,
    'describe #1 afterEach #1 (expected 26 to equal 9999)': false,
    'after #1 (expected 28 to equal 9999)': false,
  });

  t.end();
});

test('Hooks run in the correct order even if an error occurs', (t) => {
  let postman = new Postman(t);
  let i = 0, testNumber = 0;

  before(() => {
    assert.equal(++i, 1);
    throw new Error('error in before hook');
  });
  before(() => {
    assert.equal(++i, 2);
  });

  beforeEach(() => {
    assert.equal(++i, (testNumber * 5) + 3);
    throw new Error('error in beforeEach hook');
  });
  beforeEach(() => {
    assert.equal(++i, (testNumber * 5) + 4);
  });

  afterEach(() => {
    assert.equal(++i, (testNumber * 5) + 1);
    throw new Error('error in afterEach hook');
  });
  afterEach('my third hook', () => {
    assert.equal(++i, (testNumber * 5) + 2);
  });

  after(() => {
    assert.equal(++i, 28);
    throw new Error('error in after hook');
  });
  after(() => {
    assert.equal(++i, 29);
  });

  describe(() => {
    it(() => {
      testNumber++;
      assert.equal(++i, 5);
    });

    describe(() => {
      it(() => {
        testNumber++;
        assert.equal(++i, 10);
      });

      describe(() => {
        it(() => {
          testNumber++;
          assert.equal(++i, 15);
        });
      });

      it(() => {
        testNumber++;
        assert.equal(++i, 20);
      });
    });

    it(() => {
      testNumber++;
      assert.equal(++i, 25);
    });
  });

  t.equal(i, 29);

  postman.checkTests({
    'before #1 (error in before hook)': false,
    'describe #1 beforeEach #1 (error in beforeEach hook)': false,
    'describe #1 test #1': true,
    'describe #1 afterEach #1 (error in afterEach hook)': false,

    'describe #1 describe #2 beforeEach #1 (error in beforeEach hook)': false,
    'describe #1 describe #2 test #2': true,
    'describe #1 describe #2 afterEach #1 (error in afterEach hook)': false,
    'describe #1 describe #2 describe #3 beforeEach #1 (error in beforeEach hook)': false,
    'describe #1 describe #2 describe #3 test #3': true,
    'describe #1 describe #2 describe #3 afterEach #1 (error in afterEach hook)': false,

    'describe #1 describe #2 test #4': true,

    'describe #1 test #5': true,
    'after #1 (error in after hook)': false,
  });

  t.end();
});
