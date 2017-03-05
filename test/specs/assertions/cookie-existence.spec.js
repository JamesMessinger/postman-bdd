'use strict';

const test = require('tape');
const Postman = require('../../fixtures/postman');

test('cookie existence assertion with empty request/response', (t) => {
  let postman = new Postman(t);
  postman.request.method = 'GET';

  t.doesNotThrow(() => {
    request.should.not.have.cookies;
    expect(request).not.to.have.cookies;
    request.should.not.have.cookie();
    request.should.not.have.cookie('foo');

    response.should.not.have.cookies;
    expect(response).not.to.have.cookies;
    response.should.not.have.cookie();
    response.should.not.have.cookie('foo');
  });

  t.throws(() =>
    request.should.have.cookies,
    /expected the request to have cookies/
  );

  t.throws(() =>
    request.should.have.cookie('foo'),
    /expected cookie 'foo' to exist/
  );

  t.throws(() =>
    response.should.have.cookies,
    /expected the response to have cookies/
  );

  t.throws(() =>
    response.should.have.cookie('foo'),
    /expected cookie 'foo' to exist/
  );

  t.end();
});

test('request cookie existence assertion (pass)', (t) => {
  let postman = new Postman(t);

  postman.request.headers.cookie = 'x=y; foo=bar; empty=';

  t.doesNotThrow(() => {
    request.should.have.cookies;
    expect(request).to.have.cookies;

    request.should.have.cookie('x');
    expect(request).to.have.cookie('foo');

    request.should.have.cookie('empty');
    expect(request).to.have.cookie('empty');

    request.should.not.have.cookie('bar');
    expect(request).not.to.have.cookie('y');
    expect(request).not.to.have.cookie('');
    expect(request).not.to.have.cookie('missing');
  });

  t.end();
});

test('response cookie existence assertion (pass)', (t) => {
  let postman = new Postman(t);

  postman.responseHeaders['set-cookie'] = [
    'x=y;',
    'foo=bar; path=/; expires=Sat, 31 Dec 2050 00:00:00 -0000; secure; HttpOnly; SameSite=Strict',
    'empty=',
  ];

  t.doesNotThrow(() => {
    response.should.have.cookies;
    expect(response).to.have.cookies;

    response.should.have.cookie('x');
    expect(response).to.have.cookie('foo');
    expect(response).to.have.cookie('empty');

    response.should.not.have.cookie('bar');
    expect(response).not.to.have.cookie('y');
    expect(response).not.to.have.cookie('');
    expect(response).not.to.have.cookie('missing');
  });

  t.end();
});

test('request cookie existence assertion (fail)', (t) => {
  let postman = new Postman(t);

  postman.request.headers.cookie = 'x=y; foo=bar; empty=';

  t.throws(() =>
    request.should.not.have.cookies,
    /expected the response to not have any cookies/
  );

  t.throws(() =>
    expect(request).not.to.have.cookie('foo'),
    /expected cookie 'foo' to not exist/
  );

  t.throws(() =>
    request.should.have.cookie('y'),
    /expected cookie 'y' to exist/
  );

  t.throws(() =>
    expect(request).not.to.have.cookie('empty'),
    /expected cookie 'empty' to not exist/
  );

  t.throws(() =>
    request.should.have.cookie('missing'),
    /expected cookie 'missing' to exist/
  );

  t.end();
});

test('response cookie existence assertion (fail)', (t) => {
  let postman = new Postman(t);

  postman.responseHeaders['set-cookie'] = [
    'x=y;',
    'foo=bar; path=/; expires=Sat, 31 Dec 2050 00:00:00 -0000; secure; HttpOnly; SameSite=Strict',
    'empty=',
  ];

  t.throws(() =>
    response.should.not.have.cookies,
    /expected the response to not have any cookies/
  );

  t.throws(() =>
    expect(response).not.to.have.cookie('foo'),
    /expected cookie 'foo' to not exist/
  );

  t.throws(() =>
    response.should.have.cookie('y'),
    /expected cookie 'y' to exist/
  );

  t.throws(() =>
    expect(response).not.to.have.cookie('empty'),
    /expected cookie 'empty' to not exist/
  );

  t.throws(() =>
    response.should.have.cookie('missing'),
    /expected cookie 'missing' to exist/
  );

  t.end();
});
