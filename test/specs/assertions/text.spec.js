'use strict';

const test = require('tape');
const Postman = require('../../fixtures/postman');

test('text assertion with empty response', (t) => {
  new Postman(t);

  t.doesNotThrow(() => {
    response.should.not.be.text;
  });

  t.throws(() =>
    response.should.be.text,
  /expected the response type to be 'text' but got '<content-type-not-set>'/
  );

  t.end();
});

test('text assertion with text/plain response', (t) => {
  new Postman(t, {
    responseHeaders: {
      'content-type': 'text/plain; charset=utf-8',
    }
  });

  t.doesNotThrow(() => {
    response.should.be.text;
    expect(response).to.be.text;

    response.should.not.be.html;
    expect(response).not.to.be.json;
  });

  t.end();
});

test('text assertion with non-text response', (t) => {
  new Postman(t, {
    responseHeaders: {
      'content-type': 'text/rtf; charset=utf-8',
    }
  });

  t.doesNotThrow(() => {
    response.should.not.be.text;
  });

  t.throws(() =>
    expect(response).to.be.text,
  /expected the response type to be 'text' but got 'text\/rtf; charset=utf-8'/
  );

  t.end();
});
