'use strict';

const test = require('tape');
const Postman = require('../../fixtures/postman');

test('header existence assertion with empty request/response', (t) => {
  let postman = new Postman(t);
  postman.request.method = 'GET';

  t.doesNotThrow(() => {
    request.should.not.have.headers;
    expect(request).not.to.have.headers;
    request.should.not.have.header();
    request.should.not.have.header('foo');

    response.should.not.have.headers;
    expect(response).not.to.have.headers;
    response.should.not.have.header();
    response.should.not.have.header('foo');
  });

  t.throws(() =>
    request.should.have.headers,
    /expected the request to have headers/
  );

  t.throws(() =>
    request.should.have.header('foo'),
    /expected header 'foo' to exist/
  );

  t.throws(() =>
    response.should.have.headers,
    /expected the response to have headers/
  );

  t.throws(() =>
    response.should.have.header('foo'),
    /expected header 'foo' to exist/
  );

  t.end();
});

test('request header existence assertion (pass)', (t) => {
  let postman = new Postman(t);

  postman.request.headers.foo = 'bar';
  postman.request.headers['content-type'] = '';
  postman.request.headers['x-powered-by'] = 'my cool web server';
  postman.request.headers['set-cookie'] = 'myCookie=hello';

  t.doesNotThrow(() => {
    request.should.have.headers;
    expect(request).to.have.headers;

    request.should.have.header('foo');
    request.should.have.header('Content-Type');
    request.should.not.have.header('User-Agent');

    expect(request).to.have.header('Set-Cookie');
    expect(request).not.to.have.header('bar');

    request.should.have.header('X-POWERED-BY');
    expect(request).to.have.header('x-powered-by');
  });

  t.end();
});

test('response header existence assertion (pass)', (t) => {
  let postman = new Postman(t);

  postman.responseHeaders.foo = 'bar';
  postman.responseHeaders['content-type'] = '';
  postman.responseHeaders['x-powered-by'] = 'my cool web server';
  postman.responseHeaders['set-cookie'] = 'myCookie=hello';

  t.doesNotThrow(() => {
    response.should.have.headers;
    expect(response).to.have.headers;

    response.should.have.header('foo');
    response.should.have.header('Content-Type');
    response.should.not.have.header('User-Agent');

    expect(response).to.have.header('Set-Cookie');
    expect(response).not.to.have.header('bar');

    response.should.have.header('X-POWERED-BY');
    expect(response).to.have.header('x-powered-by');
  });

  t.end();
});

test('request header existence assertion (fail)', (t) => {
  let postman = new Postman(t);
  postman.request.method = 'GET';

  postman.request.headers['content-type'] = '';
  postman.request.headers['x-powered-by'] = 'my cool web server';
  postman.request.headers['set-cookie'] = 'myCookie=hello';

  t.throws(() =>
    expect(request).not.to.have.headers,
    /expected the request to not have any headers/
  );

  t.throws(() =>
    request.should.not.have.header('Content-Type'),
    /expected header 'Content-Type' to not exist/
  );

  t.throws(() =>
    expect(request).to.have.header('User-Agent'),
    /expected header 'User-Agent' to exist/
  );

  t.throws(() =>
    request.should.not.have.header('X-POWERED-BY'),
    /expected header 'X-POWERED-BY' to not exist/
  );

  t.throws(() =>
    request.should.not.have.header('X-POWERED-BY'),
    /expected header 'X-POWERED-BY' to not exist/
  );

  t.throws(() =>
    expect(request).not.to.have.header('Set-Cookie'),
    /expected header 'Set-Cookie' to not exist/
  );

  t.end();
});

test('response header existence assertion (fail)', (t) => {
  let postman = new Postman(t);

  postman.responseHeaders['content-type'] = '';
  postman.responseHeaders['x-powered-by'] = 'my cool web server';
  postman.responseHeaders['set-cookie'] = 'myCookie=hello';

  t.throws(() =>
    expect(response).not.to.have.headers,
    /expected the response to not have any headers/
  );

  t.throws(() =>
    response.should.not.have.header('Content-Type'),
    /expected header 'Content-Type' to not exist/
  );

  t.throws(() =>
    expect(response).to.have.header('User-Agent'),
    /expected header 'User-Agent' to exist/
  );

  t.throws(() =>
    response.should.not.have.header('X-POWERED-BY'),
    /expected header 'X-POWERED-BY' to not exist/
  );

  t.throws(() =>
    response.should.not.have.header('X-POWERED-BY'),
    /expected header 'X-POWERED-BY' to not exist/
  );

  t.throws(() =>
    expect(response).not.to.have.header('Set-Cookie'),
    /expected header 'Set-Cookie' to not exist/
  );

  t.end();
});
