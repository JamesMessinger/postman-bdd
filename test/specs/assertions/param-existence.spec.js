'use strict';

const test = require('tape');
const Postman = require('../../fixtures/postman');

test('param existence assertion with empty request', (t) => {
  new Postman(t);   // eslint-disable-line no-new

  t.doesNotThrow(() => {
    request.should.not.have.params;
    expect(request).not.to.have.params;
    request.should.not.have.param();
    request.should.not.have.param('foo');
  });

  t.throws(() =>
    request.should.have.params,
    /expected the request to have query parameters/
  );

  t.throws(() =>
    request.should.have.param('foo'),
    /expected query parameter 'foo' to exist/
  );

  t.end();
});

test('param existence assertion (pass)', (t) => {
  let postman = new Postman(t);

  postman.request.url = 'http://foo.com/bar/baz?x=y&foo=bar&name-only&empty=';

  t.doesNotThrow(() => {
    request.should.have.params;
    expect(request).to.have.params;

    request.should.have.param('foo');
    expect(request).to.have.param('x');
    request.should.have.param('name-only');
    expect(request).to.have.param('empty');

    request.should.not.have.param('bar');
    expect(request).not.to.have.param('y');
  });

  t.end();
});

test('deep param existence assertion (pass)', (t) => {
  let postman = new Postman(t);

  postman.request.url = 'http://foo.com/bar/baz?person.firstName=John&person[lastName]=Doe';

  t.doesNotThrow(() => {
    request.should.have.params;
    expect(request).to.have.params;

    // "deep" params are treated as normal object keys, NOT as deeply-nested objects.
    // There is no official way to represent deep structures via query params
    request.should.have.param('person.firstName');
    expect(request).to.have.param('person[lastName]');

    // "deep"" makes no difference
    request.should.have.deep.param('person.firstName');
    expect(request).to.have.deep.param('person[lastName]');

    request.should.not.have.param('person');
    expect(request).not.to.have.deep.param('firstName');
  });

  t.end();
});

test('param existence assertion (fail)', (t) => {
  let postman = new Postman(t);

  postman.request.url = 'http://foo.com/bar/baz?x=y&foo=bar&name-only&empty=';

  t.throws(() =>
    expect(request).not.to.have.params,
    /expected the request to not have any query parameters/
  );

  t.throws(() =>
    request.should.not.have.param('foo'),
    /expected query parameter 'foo' to not exist/
  );

  t.throws(() =>
    expect(request).not.to.have.param('x'),
    /expected query parameter 'x' to not exist/
  );

  t.throws(() =>
    expect(request).not.to.have.param('name-only'),
    /expected query parameter 'name-only' to not exist/
  );

  t.throws(() =>
    expect(request).not.to.have.param('empty'),
    /expected query parameter 'empty' to not exist/
  );

  t.throws(() =>
    request.should.have.param('bar'),
    /expected query parameter 'bar' to exist/
  );

  t.throws(() =>
    request.should.have.param('y'),
    /expected query parameter 'y' to exist/
  );

  t.end();
});

test('deep param existence assertion (fail)', (t) => {
  let postman = new Postman(t);

  postman.request.url = 'http://foo.com/bar/baz?person.firstName=John&person[lastName]=Doe';

  t.throws(() =>
    expect(request).not.to.have.params,
    /expected the request to not have any query parameters/
  );

  t.throws(() =>
    request.should.not.have.param('person.firstName'),
    /expected query parameter 'person.firstName' to not exist/
  );

  t.throws(() =>
    expect(request).not.to.have.deep.param('person[lastName]'),
    /expected query parameter 'person\[lastName\]' to not exist/
  );

  t.throws(() =>
    request.should.have.param('person'),
    /expected query parameter 'person' to exist/
  );

  t.throws(() =>
    request.should.have.deep.param('lastName'),
    /expected query parameter 'lastName' to exist/
  );

  t.end();
});
