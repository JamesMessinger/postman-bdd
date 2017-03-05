'use strict';

const test = require('tape');
const Postman = require('../../fixtures/postman');

test('text assertion (pass)', (t) => {
  let postman = new Postman(t);

  t.doesNotThrow(() => {
    response.should.not.be.text;
  });

  postman.responseHeaders['content-type'] = 'text/plain; charset=utf-8';

  t.doesNotThrow(() => {
    response.should.be.text;
    expect(response).to.be.text;

    response.should.not.be.json;
    expect(response).not.to.be.html;
  });

  postman.responseHeaders['content-type'] = 'text/rtf; charset=utf-8';

  t.doesNotThrow(() => {
    response.should.not.be.text;
  });

  t.end();
});

test('text assertion (fail)', (t) => {
  let postman = new Postman(t);

  t.throws(() =>
    response.should.be.text,
    /expected the response type to be 'text' but got '<content-type-not-set>'/
  );

  postman.responseHeaders['content-type'] = 'application/xml; charset=utf-8';

  t.throws(() =>
    expect(response).to.be.text,
    /expected the response type to be 'text' but got 'application\/xml; charset=utf-8'/
  );

  t.end();
});
