'use strict';

const test = require('tape');
const Postman = require('../../fixtures/postman');

test('json assertion with empty response', (t) => {
  new Postman(t);

  t.doesNotThrow(() => {
    response.should.not.be.json;
  });

  t.throws(() =>
    response.should.be.json,
    /expected the response type to be 'json' but got '<content-type-not-set>'/
  );

  t.end();
});

test('json assertion with JSON response', (t) => {
  new Postman(t, {
    responseHeaders: {
      'content-type': 'application/json; charset=utf-8',
    }
  });

  t.doesNotThrow(() => {
    response.should.be.json;
    expect(response).to.be.json;

    response.should.not.be.html;
    expect(response).not.to.be.text;
  });

  t.end();
});

test('json assertion with non-JSON response', (t) => {
  new Postman(t, {
    responseHeaders: {
      'content-type': 'application/hal+json; charset=utf-8',
    }
  });

  t.doesNotThrow(() => {
    response.should.not.be.json;
  });

  t.throws(() =>
    expect(response).to.be.json,
    /expected the response type to be 'json' but got 'application\/hal\+json; charset=utf-8'/
  );

  t.end();
});
