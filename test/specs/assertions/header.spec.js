'use strict';

const test = require('tape');
const Postman = require('../../fixtures/postman');

test('header existence assertion (pass)', (t) => {
  let postman = new Postman(t);

  t.doesNotThrow(() => {
    response.should.not.have.headers;
    expect(response).not.to.have.headers;
    response.should.not.have.header();
    response.should.not.have.header('foo');
  });

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

test('header existence assertion (fail)', (t) => {
  let postman = new Postman(t);

  t.throws(() =>
    response.should.have.headers,
    /expected the response to have headers/
  );

  t.throws(() =>
    response.should.have.header('foo'),
    /expected header 'foo' to exist/
  );

  postman.responseHeaders['content-type'] = '';
  postman.responseHeaders['x-powered-by'] = 'my cool web server';
  postman.responseHeaders['set-cookie'] = 'myCookie=hello';

  t.throws(() =>
    expect(response).not.to.have.headers,
    /expected the response to not have headers/
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

test('header value assertion (pass)', (t) => {
  let postman = new Postman(t);

  t.doesNotThrow(() => {
    response.should.not.have.header('foo', undefined);
    response.should.not.have.header('foo', null);
    response.should.not.have.header('foo', 'zzzzz');
  });

  postman.responseHeaders.foo = 'bar';
  postman.responseHeaders['content-type'] = '';
  postman.responseHeaders['x-powered-by'] = 'my cool web server';
  postman.responseHeaders['set-cookie'] = 'myCookie=hello';

  t.doesNotThrow(() => {
    response.should.have.header('foo', 'bar');
    response.should.not.have.header('foo', 'zzzzz');

    response.should.have.header('Content-Type', '');
    response.should.not.have.header('Content-Type', undefined);
    response.should.not.have.header('Content-Type', null);

    expect(response).to.have.header('Set-Cookie', 'myCookie=hello');
    expect(response).not.to.have.header('Set-Cookie', 'someOtherCookie=goodbye');

    response.should.have.header('X-POWERED-BY', /^my (\w+ )+server$/);
    expect(response).not.to.have.header('x-powered-by', /^my awesome server$/);
  });

  t.end();
});

test('header value assertion (fail)', (t) => {
  let postman = new Postman(t);

  t.throws(() =>
    response.should.have.header('foo', 'bar'),
    /expected header 'foo' to have value 'bar'/
  );

  t.throws(() =>
    response.should.have.header('foo', undefined),
    /expected header 'foo' to have value undefined but got '<header-not-set>'/
  );

  postman.responseHeaders.foo = 'bar';
  postman.responseHeaders['content-type'] = 'application/json';
  postman.responseHeaders['x-powered-by'] = 'my cool web server';
  postman.responseHeaders['set-cookie'] = 'myCookie=hello';

  t.throws(() =>
    response.should.not.have.header('foo', 'bar'),
    /expected header 'foo' to not have value 'bar'/
  );

  t.throws(() =>
    response.should.have.header('foo', 'zzzzz'),
    /expected header 'foo' to have value 'zzzzz'/
  );

  t.throws(() =>
    expect(response).not.to.have.header('Set-Cookie', 'myCookie=hello'),
    /expected header 'Set-Cookie' to not have value 'myCookie=hello'/
  );

  t.throws(() =>
    expect(response).to.have.header('Set-Cookie', 'someOtherCookie=goodbye'),
    /expected header 'Set-Cookie' to have value 'someOtherCookie=goodbye'/
  );

  t.throws(() =>
    response.should.not.have.header('X-POWERED-BY', /^my (\w+ )+server$/),
    /expected header 'X-POWERED-BY' to not match \/\^my \(\\w\+ \)\+server\$\//
  );

  t.throws(() =>
    expect(response).to.have.header('x-powered-by', /^my awesome server$/),
    /expected header 'x-powered-by' to match \/\^my awesome server\$\//
  );

  t.throws(() =>
    expect(response).to.have.header('xyz', /^some expression$/),
    /expected header 'xyz' to match \/\^some expression\$\/ but got '<header-not-set>'/
  );

  t.end();
});
