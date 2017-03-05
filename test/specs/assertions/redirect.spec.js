'use strict';

const test = require('tape');
const Postman = require('../../fixtures/postman');
const codes = require('../../fixtures/codes');

test('redirect assertion (pass)', (t) => {
  let postman = new Postman(t);

  t.doesNotThrow(() => {
    response.should.not.redirect;
  });

  for (let code of codes.nonRedirect) {
    postman.responseCode.code = code;

    t.doesNotThrow(() => {
      response.should.not.redirect;
    }, `HTTP ${code} is not a redirect`);
  }

  for (let code of codes.redirect) {
    postman.responseCode.code = code;

    t.doesNotThrow(() => {
      response.should.redirect;
      expect(response).to.redirect;
    }, `HTTP ${code} is a redirect`);
  }

  t.end();
});

test('redirect assertion (fail)', (t) => {
  let postman = new Postman(t);

  t.throws(() =>
    response.should.redirect,
    /expected redirect status code but got 0/
  );

  for (let code of codes.nonRedirect) {
    postman.responseCode.code = code;

    t.throws(() =>
      response.should.redirect,
      new RegExp(`expected redirect status code but got ${code}`)
    );
  }

  for (let code of codes.redirect) {
    postman.responseCode.code = code;

    t.throws(() =>
      response.should.not.redirect,
      new RegExp(`expected not to redirect but got ${code} status`)
    );
  }

  t.end();
});
