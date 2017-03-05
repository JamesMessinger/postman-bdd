'use strict';

const test = require('tape');
const Postman = require('../../fixtures/postman');
const codes = require('../../fixtures/codes');

test('redirectTo assertion (pass)', (t) => {
  let postman = new Postman(t);

  t.doesNotThrow(() => {
    response.should.not.redirectTo('http://foo.com/bar/baz');
  });

  for (let code of codes.nonRedirect) {
    postman.responseCode.code = code;
    postman.responseHeaders.location = 'http://foo.com/bar/baz';

    t.doesNotThrow(() => {
      response.should.not.redirect;
      response.should.not.redirectTo('http://foo.com/bar/baz');
      expect(response).not.to.redirectTo('http://foo.com');
      response.should.not.redirectTo('/bar/baz');
    });
  }

  for (let code of codes.redirect) {
    postman.responseCode.code = code;
    postman.responseHeaders.location = 'http://foo.com/bar/baz';

    t.doesNotThrow(() => {
      response.should.redirect;
      response.should.redirectTo('http://foo.com/bar/baz');
      expect(response).to.redirectTo('http://foo.com/bar/baz');

      response.should.not.redirectTo('http://foo.com');
      expect(response).not.to.redirectTo('http://foo.com');
      response.should.not.redirectTo('/bar/baz');
      expect(response).not.to.redirectTo('/bar/baz');
    });
  }

  t.end();
});

test('redirectTo assertion (fail)', (t) => {
  let postman = new Postman(t);

  t.throws(() =>
    response.should.redirectTo('http://foo.com/bar/baz'),
    /expected redirect to 'http:\/\/foo.com\/bar\/baz' but got 0/
  );

  for (let code of codes.nonRedirect) {
    postman.responseCode.code = code;
    postman.responseHeaders.location = 'http://foo.com/bar/baz';

    t.throws(() =>
      response.should.redirectTo('http://foo.com/bar/baz'),
      new RegExp(`expected redirect to 'http:\/\/foo.com\/bar\/baz' but got ${code}`)
    );

    t.throws(() =>
      expect(response).to.redirectTo('http://foo.com'),
      new RegExp(`expected redirect to 'http:\/\/foo.com' but got ${code}`)
    );

    t.throws(() =>
      expect(response).to.redirectTo('/bar/baz'),
      new RegExp(`expected redirect to '\/bar\/baz' but got ${code}`)
    );
  }

  for (let code of codes.redirect) {
    postman.responseCode.code = code;
    postman.responseHeaders.location = 'http://foo.com/bar/baz';

    t.throws(() =>
      response.should.not.redirectTo('http://foo.com/bar/baz'),
      /expected not to redirect to 'http:\/\/foo.com\/bar\/baz'/
    );

    t.throws(() =>
      expect(response).to.redirectTo('http://foo.com'),
      /expected redirect to 'http:\/\/foo.com' but got 'http:\/\/foo.com\/bar\/baz'/
    );

    t.throws(() =>
      expect(response).to.redirectTo('/bar/baz'),
      /expected redirect to '\/bar\/baz' but got 'http:\/\/foo.com\/bar\/baz'/
    );
  }

  t.end();
});
