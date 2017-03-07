'use strict';

const test = require('tape');
const Postman = require('../../fixtures/postman');

test('html assertion with empty response', (t) => {
  new Postman(t);

  t.doesNotThrow(() => {
    response.should.not.be.html;
  });

  t.throws(() =>
    response.should.be.html,
    /expected the response type to be 'html' but got '<content-type-not-set>'/
  );

  t.end();
});

test('html assertion with HTML response', (t) => {
  new Postman(t, {
    responseHeaders: {
      'content-type': 'text/html; charset=utf-8',
    }
  });

  t.doesNotThrow(() => {
    response.should.be.html;
    expect(response).to.be.html;

    response.should.not.be.json;
    expect(response).not.to.be.text;
  });

  t.end();
});

test('html assertion with non-HTML response', (t) => {
  new Postman(t, {
    responseHeaders: {
      'content-type': 'text/xhtml; charset=utf-8',
    }
  });

  t.doesNotThrow(() => {
    response.should.not.be.html;
  });

  t.throws(() =>
    expect(response).to.be.html,
    /expected the response type to be 'html' but got 'text\/xhtml; charset=utf-8'/
  );

  t.end();
});
