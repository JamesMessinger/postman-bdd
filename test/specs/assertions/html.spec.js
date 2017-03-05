'use strict';

const test = require('tape');
const Postman = require('../../fixtures/postman');

test('html assertion (pass)', (t) => {
  let postman = new Postman(t);

  t.doesNotThrow(() => {
    response.should.not.be.html;
  });

  postman.responseHeaders['content-type'] = 'text/html; charset=utf-8';

  t.doesNotThrow(() => {
    response.should.be.html;
    expect(response).to.be.html;

    response.should.not.be.json;
    expect(response).not.to.be.text;
  });

  postman.responseHeaders['content-type'] = 'text/xhtml; charset=utf-8';

  t.doesNotThrow(() => {
    response.should.not.be.html;
  });

  t.end();
});

test('html assertion (fail)', (t) => {
  let postman = new Postman(t);

  t.throws(() =>
    response.should.be.html,
    /expected the response type to be 'html' but got '<content-type-not-set>'/
  );

  postman.responseHeaders['content-type'] = 'application/xml; charset=utf-8';

  t.throws(() =>
    expect(response).to.be.html,
    /expected the response type to be 'html' but got 'application\/xml; charset=utf-8'/
  );

  t.end();
});
