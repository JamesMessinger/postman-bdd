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
  afterEach(() => {
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
    '1. describe #1 - before #1': true,
    '2. describe #1 - before #2': true,
    '3. describe #1 - test #1 - beforeEach #1': true,
    '4. describe #1 - test #1 - beforeEach #2': true,
    '5. describe #1 - test #1': true,
    '6. describe #1 - test #1 - afterEach #1': true,
    '7. describe #1 - test #1 - afterEach #2': true,
    '8. describe #1 - describe #2 - test #2 - beforeEach #1': true,
    '9. describe #1 - describe #2 - test #2 - beforeEach #2': true,
    '10. describe #1 - describe #2 - test #2': true,
    '11. describe #1 - describe #2 - test #2 - afterEach #1': true,
    '12. describe #1 - describe #2 - test #2 - afterEach #2': true,
    '13. describe #1 - describe #2 - describe #3 - test #3 - beforeEach #1': true,
    '14. describe #1 - describe #2 - describe #3 - test #3 - beforeEach #2': true,
    '15. describe #1 - describe #2 - describe #3 - test #3': true,
    '16. describe #1 - describe #2 - describe #3 - test #3 - afterEach #1': true,
    '17. describe #1 - describe #2 - describe #3 - test #3 - afterEach #2': true,
    '18. describe #1 - describe #2 - test #4 - beforeEach #1': true,
    '19. describe #1 - describe #2 - test #4 - beforeEach #2': true,
    '20. describe #1 - describe #2 - test #4': true,
    '21. describe #1 - describe #2 - test #4 - afterEach #1': true,
    '22. describe #1 - describe #2 - test #4 - afterEach #2': true,
    '23. describe #1 - test #5 - beforeEach #1': true,
    '24. describe #1 - test #5 - beforeEach #2': true,
    '25. describe #1 - test #5': true,
    '26. describe #1 - test #5 - afterEach #1': true,
    '27. describe #1 - test #5 - afterEach #2': true,
    '28. describe #1 - after #1': true,
    '29. describe #1 - after #2': true,
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
  afterEach(() => {
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
    '1. describe #1 - before #1 (expected 1 to equal 9999)': false,
    '2. describe #1 - before #2': true,
    '3. describe #1 - test #1 - beforeEach #1 (expected 3 to equal 9999)': false,
    '4. describe #1 - test #1 - beforeEach #2': true,
    '5. describe #1 - test #1': true,
    '6. describe #1 - test #1 - afterEach #1 (expected 6 to equal 9999)': false,
    '7. describe #1 - test #1 - afterEach #2': true,
    '8. describe #1 - describe #2 - test #2 - beforeEach #1 (expected 8 to equal 9999)': false,
    '9. describe #1 - describe #2 - test #2 - beforeEach #2': true,
    '10. describe #1 - describe #2 - test #2': true,
    '11. describe #1 - describe #2 - test #2 - afterEach #1 (expected 11 to equal 9999)': false,
    '12. describe #1 - describe #2 - test #2 - afterEach #2': true,
    '13. describe #1 - describe #2 - describe #3 - test #3 - beforeEach #1 (expected 13 to equal 9999)': false,
    '14. describe #1 - describe #2 - describe #3 - test #3 - beforeEach #2': true,
    '15. describe #1 - describe #2 - describe #3 - test #3': true,
    '16. describe #1 - describe #2 - describe #3 - test #3 - afterEach #1 (expected 16 to equal 9999)': false,
    '17. describe #1 - describe #2 - describe #3 - test #3 - afterEach #2': true,
    '18. describe #1 - describe #2 - test #4 - beforeEach #1 (expected 18 to equal 9999)': false,
    '19. describe #1 - describe #2 - test #4 - beforeEach #2': true,
    '20. describe #1 - describe #2 - test #4': true,
    '21. describe #1 - describe #2 - test #4 - afterEach #1 (expected 21 to equal 9999)': false,
    '22. describe #1 - describe #2 - test #4 - afterEach #2': true,
    '23. describe #1 - test #5 - beforeEach #1 (expected 23 to equal 9999)': false,
    '24. describe #1 - test #5 - beforeEach #2': true,
    '25. describe #1 - test #5': true,
    '26. describe #1 - test #5 - afterEach #1 (expected 26 to equal 9999)': false,
    '27. describe #1 - test #5 - afterEach #2': true,
    '28. describe #1 - after #1 (expected 28 to equal 9999)': false,
    '29. describe #1 - after #2': true,
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
  afterEach(() => {
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
    '1. describe #1 - before #1 (error in before hook)': false,
    '2. describe #1 - before #2': true,
    '3. describe #1 - test #1 - beforeEach #1 (error in beforeEach hook)': false,
    '4. describe #1 - test #1 - beforeEach #2': true,
    '5. describe #1 - test #1': true,
    '6. describe #1 - test #1 - afterEach #1 (error in afterEach hook)': false,
    '7. describe #1 - test #1 - afterEach #2': true,
    '8. describe #1 - describe #2 - test #2 - beforeEach #1 (error in beforeEach hook)': false,
    '9. describe #1 - describe #2 - test #2 - beforeEach #2': true,
    '10. describe #1 - describe #2 - test #2': true,
    '11. describe #1 - describe #2 - test #2 - afterEach #1 (error in afterEach hook)': false,
    '12. describe #1 - describe #2 - test #2 - afterEach #2': true,
    '13. describe #1 - describe #2 - describe #3 - test #3 - beforeEach #1 (error in beforeEach hook)': false,
    '14. describe #1 - describe #2 - describe #3 - test #3 - beforeEach #2': true,
    '15. describe #1 - describe #2 - describe #3 - test #3': true,
    '16. describe #1 - describe #2 - describe #3 - test #3 - afterEach #1 (error in afterEach hook)': false,
    '17. describe #1 - describe #2 - describe #3 - test #3 - afterEach #2': true,
    '18. describe #1 - describe #2 - test #4 - beforeEach #1 (error in beforeEach hook)': false,
    '19. describe #1 - describe #2 - test #4 - beforeEach #2': true,
    '20. describe #1 - describe #2 - test #4': true,
    '21. describe #1 - describe #2 - test #4 - afterEach #1 (error in afterEach hook)': false,
    '22. describe #1 - describe #2 - test #4 - afterEach #2': true,
    '23. describe #1 - test #5 - beforeEach #1 (error in beforeEach hook)': false,
    '24. describe #1 - test #5 - beforeEach #2': true,
    '25. describe #1 - test #5': true,
    '26. describe #1 - test #5 - afterEach #1 (error in afterEach hook)': false,
    '27. describe #1 - test #5 - afterEach #2': true,
    '28. describe #1 - after #1 (error in after hook)': false,
    '29. describe #1 - after #2': true,
  });

  t.end();
});
