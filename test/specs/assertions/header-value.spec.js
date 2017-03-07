'use strict';

const test = require('tape');
const Postman = require('../../fixtures/postman');

test('request header value assertion with empty request/response', (t) => {
  new Postman(t);

  t.doesNotThrow(() => {
    request.should.not.have.header('foo', undefined);
    request.should.not.have.header('foo', null);
    request.should.not.have.header('foo', 'zzzzz');

    response.should.not.have.header('foo', undefined);
    response.should.not.have.header('foo', null);
    response.should.not.have.header('foo', 'zzzzz');
  });

  t.throws(() =>
    request.should.have.header('foo', 'bar'),
    /expected header 'foo' to have value 'bar'/
  );

  t.throws(() =>
    request.should.have.header('foo', undefined),
    /expected header 'foo' to have value undefined but got '<header-not-set>'/
  );

  t.throws(() =>
    response.should.have.header('foo', 'bar'),
    /expected header 'foo' to have value 'bar'/
  );

  t.throws(() =>
    response.should.have.header('foo', undefined),
    /expected header 'foo' to have value undefined but got '<header-not-set>'/
  );

  t.end();
});

test('request header value assertion (pass)', (t) => {
  new Postman(t, {
    request: {
      headers: {
        foo: 'bar',
        'content-type': '',
        'x-powered-by': 'my cool web server',
        'set-cookie': 'myCookie=hello',
      }
    }
  });

  t.doesNotThrow(() => {
    request.should.have.header('foo', 'bar');
    request.should.not.have.header('foo', 'zzzzz');

    request.should.have.header('Content-Type', '');
    request.should.not.have.header('Content-Type', undefined);
    request.should.not.have.header('Content-Type', null);

    expect(request).to.have.header('Set-Cookie', 'myCookie=hello');
    expect(request).not.to.have.header('Set-Cookie', 'someOtherCookie=goodbye');

    request.should.have.header('X-POWERED-BY', /^my (\w+ )+server$/);
    expect(request).not.to.have.header('x-powered-by', /^my awesome server$/);
  });

  t.end();
});

test('response header value assertion (pass)', (t) => {
  new Postman(t, {
    responseHeaders: {
      foo: 'bar',
      'content-type': '',
      'x-powered-by': 'my cool web server',
      'set-cookie': 'myCookie=hello',
    }
  });

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

test('request header value assertion (fail)', (t) => {
  new Postman(t, {
    request: {
      headers: {
        foo: 'bar',
        'content-type': '',
        'x-powered-by': 'my cool web server',
        'set-cookie': 'myCookie=hello',
      }
    }
  });

  t.throws(() =>
    request.should.not.have.header('foo', 'bar'),
    /expected header 'foo' to not have value 'bar'/
  );

  t.throws(() =>
    request.should.have.header('foo', 'zzzzz'),
    /expected header 'foo' to have value 'zzzzz'/
  );

  t.throws(() =>
    expect(request).not.to.have.header('Set-Cookie', 'myCookie=hello'),
    /expected header 'Set-Cookie' to not have value 'myCookie=hello'/
  );

  t.throws(() =>
    expect(request).to.have.header('Set-Cookie', 'someOtherCookie=goodbye'),
    /expected header 'Set-Cookie' to have value 'someOtherCookie=goodbye'/
  );

  t.throws(() =>
    request.should.not.have.header('X-POWERED-BY', /^my (\w+ )+server$/),
    /expected header 'X-POWERED-BY' to not match \/\^my \(\\w\+ \)\+server\$\//
  );

  t.throws(() =>
    expect(request).to.have.header('x-powered-by', /^my awesome server$/),
    /expected header 'x-powered-by' to match \/\^my awesome server\$\//
  );

  t.throws(() =>
    expect(request).to.have.header('xyz', /^some expression$/),
    /expected header 'xyz' to match \/\^some expression\$\/ but got '<header-not-set>'/
  );

  t.end();
});

test('response header value assertion (fail)', (t) => {
  new Postman(t, {
    responseHeaders: {
      foo: 'bar',
      'content-type': '',
      'x-powered-by': 'my cool web server',
      'set-cookie': 'myCookie=hello',
    }
  });

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
