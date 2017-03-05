'use strict';

const test = require('tape');
const Postman = require('../../fixtures/postman');

test('param value assertion with empty request', (t) => {
  new Postman(t);   // eslint-disable-line no-new

  t.doesNotThrow(() => {
    request.should.not.have.param('foo', undefined);
    request.should.not.have.param('foo', null);
    request.should.not.have.param('foo', 'zzzzz');
  });

  t.throws(() =>
    request.should.have.param('foo', 'bar'),
    /expected query parameter 'foo' to have value 'bar'/
  );

  t.throws(() =>
    request.should.have.param('foo', undefined),
    /expected query parameter 'foo' to have value undefined but got '<parameter-does-not-exist>'/
  );

  t.end();
});

test('param value assertion (pass)', (t) => {
  let postman = new Postman(t);

  postman.request.url = 'http://foo.com/bar/baz?x=y&foo=bar&person.name[first]=John&name-only&empty=';

  t.doesNotThrow(() => {
    request.should.have.param('foo', 'bar');
    expect(request).to.have.param('x', 'y');
    request.should.have.param('person.name[first]', 'John');

    request.should.not.have.param('foo', 'bazzz');
    expect(request).not.to.have.param('x', 'zzzzz');
    expect(request).not.to.have.param('person.name[first]', 'Bob');

    request.should.have.param('name-only', '');
    request.should.not.have.param('name-only', undefined);
    request.should.not.have.param('name-only', null);

    expect(request).to.have.param('empty', '');
    expect(request).to.not.have.param('empty', undefined);
    expect(request).to.not.have.param('empty', null);

    request.should.not.have.param('missing', '');
    request.should.not.have.param('missing', undefined);
    request.should.not.have.param('missing', null);

    request.should.have.param('foo', /^b.{1}r$/);
    expect(request).not.to.have.param('foo', /^BAR$/);
  });

  t.end();
});

test('param value assertion (fail)', (t) => {
  let postman = new Postman(t);

  postman.request.url = 'http://foo.com/bar/baz?x=y&foo=bar&person.name[first]=John&name-only&empty=';

  t.throws(() =>
    request.should.not.have.param('foo', 'bar'),
    /expected query parameter 'foo' to not have value 'bar'/
  );

  t.throws(() =>
    request.should.have.param('foo', 'zzzzz'),
    /expected query parameter 'foo' to have value 'zzzzz'/
  );

  t.throws(() =>
    expect(request).not.to.have.param('person.name[first]', 'John'),
    /expected query parameter 'person.name\[first\]' to not have value 'John'/
  );

  t.throws(() =>
    expect(request).to.have.param('person.name[first]', /^Sarah|Alice|Yvonne$/),
    /expected query parameter 'person.name\[first\]' to match \/\^Sarah\|Alice\|Yvonne\$\//
  );

  t.throws(() =>
    request.should.not.have.param('name-only', /^$/),
    /expected query parameter 'name-only' to not match \/\^\$\//
  );

  t.throws(() =>
    expect(request).to.have.param('empty', 'hello world'),
    /expected query parameter 'empty' to have value 'hello world'/
  );

  t.throws(() =>
    expect(request).to.have.param('missing', /^some expression$/),
    /expected query parameter 'missing' to match \/\^some expression\$\/ but got '<parameter-does-not-exist>'/
  );

  t.end();
});
