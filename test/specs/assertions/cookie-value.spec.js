'use strict';

const test = require('tape');
const Postman = require('../../fixtures/postman');

test('cookie value assertion with empty request/response', (t) => {
  new Postman(t, {
    request: {
      method: 'GET',
    }
  });

  t.doesNotThrow(() => {
    request.should.not.have.cookie('foo', undefined);
    request.should.not.have.cookie('foo', null);
    request.should.not.have.cookie('foo', 'zzzzz');

    response.should.not.have.cookie('foo', undefined);
    response.should.not.have.cookie('foo', null);
    response.should.not.have.cookie('foo', 'zzzzz');
  });

  t.throws(() =>
    request.should.have.cookie('foo', 'bar'),
  /expected cookie 'foo' to have value 'bar'/
  );

  t.throws(() =>
    request.should.have.cookie('foo', undefined),
  /expected cookie 'foo' to have value undefined but got '<cookie-not-set>'/
  );

  t.throws(() =>
    response.should.have.cookie('foo', 'bar'),
  /expected cookie 'foo' to have value 'bar'/
  );

  t.throws(() =>
    response.should.have.cookie('foo', undefined),
  /expected cookie 'foo' to have value undefined but got '<cookie-not-set>'/
  );

  t.end();
});

test('request cookie value assertion (pass)', (t) => {
  new Postman(t, {
    request: {
      headers: {
        cookie: 'x=y; foo=bar; empty=',
      }
    }
  });

  t.doesNotThrow(() => {
    request.should.have.cookie('foo', 'bar');
    request.should.not.have.cookie('foo', 'zzzzz');

    request.should.have.cookie('empty', '');
    request.should.not.have.cookie('empty', undefined);
    request.should.not.have.cookie('empty', null);

    request.should.not.have.cookie('missing', '');
    request.should.not.have.cookie('missing', undefined);
    request.should.not.have.cookie('missing', null);

    request.should.have.cookie('foo', /^b.{1}r$/);
    expect(request).not.to.have.cookie('x', /^a|b|c$/);
  });

  t.end();
});

test('response cookie value assertion (pass)', (t) => {
  new Postman(t, {
    responseHeaders: {
      'set-cookie': [
        'x=y;',
        'foo=bar; path=/; expires=Sat, 31 Dec 2050 00:00:00 -0000; secure; HttpOnly; SameSite=Strict',
        'empty=',
      ],
    }
  });

  t.doesNotThrow(() => {
    response.should.have.cookie('foo', 'bar');
    response.should.not.have.cookie('foo', 'zzzzz');

    response.should.have.cookie('empty', '');
    response.should.not.have.cookie('empty', undefined);
    response.should.not.have.cookie('empty', null);

    response.should.not.have.cookie('missing', '');
    response.should.not.have.cookie('missing', undefined);
    response.should.not.have.cookie('missing', null);

    response.should.have.cookie('foo', /^b.{1}r$/);
    expect(response).not.to.have.cookie('x', /^a|b|c$/);
  });

  t.end();
});

test('request cookie value assertion (fail)', (t) => {
  new Postman(t, {
    request: {
      headers: {
        cookie: 'x=y; foo=bar; empty=',
      }
    }
  });

  t.throws(() =>
    request.should.not.have.cookie('foo', 'bar'),
  /expected cookie 'foo' to not have value 'bar'/
  );

  t.throws(() =>
    request.should.have.cookie('foo', 'zzzzz'),
  /expected cookie 'foo' to have value 'zzzzz'/
  );

  t.throws(() =>
    expect(request).not.to.have.cookie('empty', ''),
  /expected cookie 'empty' to not have value ''/
  );

  t.throws(() =>
    expect(request).to.have.cookie('missing', /^Sarah|Alice|Yvonne$/),
  /expected cookie 'missing' to match \/\^Sarah\|Alice\|Yvonne\$\/ but got '\<cookie-not-set\>'/
  );

  t.throws(() =>
    request.should.not.have.cookie('empty', /^$/),
  /expected cookie 'empty' to not match \/\^\$\//
  );

  t.end();
});

test('response cookie value assertion (fail)', (t) => {
  new Postman(t, {
    responseHeaders: {
      'set-cookie': [
        'x=y;',
        'foo=bar; path=/; expires=Sat, 31 Dec 2050 00:00:00 -0000; secure; HttpOnly; SameSite=Strict',
        'empty=',
      ],
    }
  });

  t.throws(() =>
    response.should.not.have.cookie('foo', 'bar'),
  /expected cookie 'foo' to not have value 'bar'/
  );

  t.throws(() =>
    response.should.have.cookie('foo', 'zzzzz'),
  /expected cookie 'foo' to have value 'zzzzz'/
  );

  t.throws(() =>
    expect(response).not.to.have.cookie('empty', ''),
  /expected cookie 'empty' to not have value ''/
  );

  t.throws(() =>
    expect(response).to.have.cookie('missing', /^Sarah|Alice|Yvonne$/),
  /expected cookie 'missing' to match \/\^Sarah\|Alice\|Yvonne\$\/ but got '\<cookie-not-set\>'/
  );

  t.throws(() =>
    response.should.not.have.cookie('empty', /^$/),
  /expected cookie 'empty' to not match \/\^\$\//
  );

  t.end();
});
