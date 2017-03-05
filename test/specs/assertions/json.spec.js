'use strict';

const test = require('tape');
const Postman = require('../../fixtures/postman');

test('json assertion (pass)', (t) => {
  let postman = new Postman(t);

  t.doesNotThrow(() => {
    response.should.not.be.json;
  });

  postman.responseHeaders['content-type'] = 'application/json; charset=utf-8';

  t.doesNotThrow(() => {
    response.should.be.json;
    expect(response).to.be.json;

    response.should.not.be.html;
    expect(response).not.to.be.text;
  });

  postman.responseHeaders['content-type'] = 'application/hal+json; charset=utf-8';

  t.doesNotThrow(() => {
    response.should.not.be.json;
  });

  t.end();
});

test('json assertion (fail)', (t) => {
  let postman = new Postman(t);

  t.throws(() =>
    response.should.be.json,
    /expected the response type to be 'json' but got '<content-type-not-set>'/
  );

  postman.responseHeaders['content-type'] = 'application/xml; charset=utf-8';

  t.throws(() =>
    expect(response).to.be.json,
    /expected the response type to be 'json' but got 'application\/xml; charset=utf-8'/
  );

  t.end();
});
