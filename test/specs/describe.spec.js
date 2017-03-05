'use strict';

const test = require('tape');
const Postman = require('../fixtures/postman');

test('`describe` without any args', (t) => {
  let postman = new Postman(t);

  describe();

  postman.checkTests({
    'describe #1 (this.fn is not a function)': false,
  });

  t.end();
});

test('`describe` with only a name', (t) => {
  let postman = new Postman(t);

  describe('my test suite');

  postman.checkTests({
    'my test suite (this.fn is not a function)': false,
  });

  t.end();
});

test('`describe` with only a function', (t) => {
  let postman = new Postman(t);

  describe(() => {});

  postman.checkTests({});

  t.end();
});

test('`describe` without any tests', (t) => {
  let postman = new Postman(t);

  describe('my test suite', () => {});

  postman.checkTests({});

  t.end();
});

test('Error in `describe` block', (t) => {
  let postman = new Postman(t);

  describe('my test suite', () => {
    throw new Error('BOOM!');
  });

  postman.checkTests({
    'my test suite (BOOM!)': false,
  });

  t.end();
});

test('Error in unnamed `describe` block', (t) => {
  let postman = new Postman(t);

  describe(() => {
    throw new Error('BOOM!');
  });

  postman.checkTests({
    'describe #1 (BOOM!)': false,
  });

  t.end();
});
