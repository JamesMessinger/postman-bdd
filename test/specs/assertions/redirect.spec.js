'use strict';

const test = require('tape');
const Postman = require('../../fixtures/postman');
const codes = require('../../fixtures/codes');

for (let code of codes.nonRedirect) {

  test(`redirect assertion with ${code} respnose`, (t) => {
    new Postman(t, {
      responseCode: { code }
    });

    t.doesNotThrow(() => {
      response.should.not.redirect;
    });

    t.doesNotThrow(() => {
      response.should.not.redirect;
    }, `HTTP ${code} is not a redirect`);

    t.throws(() =>
      response.should.redirect,
      new RegExp(`expected redirect status code but got ${code}`)
    );

    t.end();
  });

}

for (let code of codes.redirect) {

  test(`redirect assertion with ${code} respnose`, (t) => {
    new Postman(t, {
      responseCode: { code }
    });

    t.doesNotThrow(() => {
      response.should.redirect;
      expect(response).to.redirect;
    }, `HTTP ${code} is a redirect`);

    t.throws(() =>
      response.should.not.redirect,
      new RegExp(`expected not to redirect but got ${code} status`)
    );

    t.end();
  });

}
