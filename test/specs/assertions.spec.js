'use strict';

const test = require('tape');
const Postman = require('../fixtures/postman');

test('status assertion (pass)', (t) => {
  let postman = new Postman(t);
  postman.responseCode.code = 200;

  expect(response).to.have.status(200);
  response.should.have.status(200);

  expect(response).not.to.have.status(404);
  response.should.not.have.status(404);

  t.end();
});

test('status assertion (fail)', (t) => {
  let postman = new Postman(t);
  postman.responseCode.code = 200;

  (() => {
    response.should.have.status(404);
  }).should.throw('expected the response to have status code 404');

  (() => {
    expect(response).to.have.status(404);
  }).should.throw('expected the response to have status code 404');

  (() => {
    response.should.not.have.status(200);
  }).should.throw('expected the response to not have status code 200');

  (() => {
    expect(response).not.to.have.status(200);
  }).should.throw('expected the response to not have status code 200');

  t.end();
});

test('ip assertion (pass)', (t) => {
  new Postman(t);   // eslint-disable-line no-new

  // IPv4
  '127.0.0.1'.should.be.an.ip;
  expect('127.0.0.1').to.be.an.ip;

  // IPv6
  '2001:0db8:85a3:0000:0000:8a2e:0370:7334'.should.be.an.ip;
  expect('2001:0db8:85a3:0000:0000:8a2e:0370:7334').to.be.an.ip;

  // Invalid
  'hello world'.should.not.be.an.ip;
  expect(123456789).not.to.be.an.ip;
  expect('123456789').not.to.be.an.ip;

  t.end();
});

test('ip assertion (fail)', (t) => {
  new Postman(t);   // eslint-disable-line no-new

  (() => {
    'hello world'.should.be.an.ip;
  }).should.throw("expected 'hello world' to be an ip");

  (() => {
    expect('123456789').to.be.an.ip;
  }).should.throw("expected '123456789' to be an ip");

  (() => {
    expect(123456789).to.be.an.ip;
  }).should.throw('expected 123456789 to be an ip');

  (() => {
    '127.0.0.1'.should.not.be.an.ip;
  }).should.throw("expected '127.0.0.1' to not be an ip");

  (() => {
    expect('2001:0db8:85a3:0000:0000:8a2e:0370:7334').not.to.be.an.ip;
  }).should.throw("expected '2001:0db8:85a3:0000:0000:8a2e:0370:7334' to not be an ip");

  t.end();
});

test('header existence assertion (pass)', (t) => {
  let postman = new Postman(t);

  response.should.not.have.headers;
  expect(response).not.to.have.headers;
  response.should.not.have.header();
  response.should.not.have.header('foo');

  postman.responseHeaders.foo = 'bar';
  postman.responseHeaders['content-type'] = '';
  postman.responseHeaders['x-powered-by'] = 'my cool web server';
  postman.responseHeaders['set-cookie'] = 'myCookie=hello';

  response.should.have.headers;
  expect(response).to.have.headers;

  response.should.have.header('foo');
  response.should.have.header('Content-Type');
  response.should.not.have.header('User-Agent');

  expect(response).to.have.header('Set-Cookie');
  expect(response).not.to.have.header('bar');

  response.should.have.header('X-POWERED-BY');
  expect(response).to.have.header('x-powered-by');

  t.end();
});

test('header existence assertion (fail)', (t) => {
  let postman = new Postman(t);

  (() => {
    response.should.have.headers;
  }).should.throw('expected the response to have headers');

  (() => {
    response.should.have.header('foo');
  }).should.throw("expected header 'foo' to exist");

  postman.responseHeaders['content-type'] = '';
  postman.responseHeaders['x-powered-by'] = 'my cool web server';
  postman.responseHeaders['set-cookie'] = 'myCookie=hello';

  (() => {
    expect(response).not.to.have.headers;
  }).should.throw('expected the response to not have headers');

  (() => {
    response.should.not.have.header('Content-Type');
  }).should.throw("expected header 'Content-Type' to not exist");

  (() => {
    expect(response).to.have.header('User-Agent');
  }).should.throw("expected header 'User-Agent' to exist");

  (() => {
    response.should.not.have.header('X-POWERED-BY');
  }).should.throw("expected header 'X-POWERED-BY' to not exist");

  (() => {
    response.should.not.have.header('X-POWERED-BY');
  }).should.throw("expected header 'X-POWERED-BY' to not exist");

  (() => {
    expect(response).not.to.have.header('Set-Cookie');
  }).should.throw("expected header 'Set-Cookie' to not exist");

  t.end();
});

test('header value assertion (pass)', (t) => {
  let postman = new Postman(t);

  response.should.not.have.header('foo', undefined);
  response.should.not.have.header('foo', null);
  response.should.not.have.header('foo', 'zzzzz');

  postman.responseHeaders.foo = 'bar';
  postman.responseHeaders['content-type'] = '';
  postman.responseHeaders['x-powered-by'] = 'my cool web server';
  postman.responseHeaders['set-cookie'] = 'myCookie=hello';

  response.should.have.header('foo', 'bar');
  response.should.not.have.header('foo', 'zzzzz');

  response.should.have.header('Content-Type', '');
  response.should.not.have.header('Content-Type', undefined);
  response.should.not.have.header('Content-Type', null);

  expect(response).to.have.header('Set-Cookie', 'myCookie=hello');
  expect(response).not.to.have.header('Set-Cookie', 'someOtherCookie=goodbye');

  response.should.have.header('X-POWERED-BY', /^my (\w+ )+server$/);
  expect(response).not.to.have.header('x-powered-by', /^my awesome server$/);

  t.end();
});

test('header value assertion (fail)', (t) => {
  let postman = new Postman(t);

  (() => {
    response.should.have.header('foo', 'bar');
  }).should.throw("expected header 'foo' to have value 'bar'");

  (() => {
    response.should.have.header('foo', undefined);
  }).should.throw("expected header 'foo' to have value undefined but got '<header-not-set>'");

  postman.responseHeaders.foo = 'bar';
  postman.responseHeaders['content-type'] = 'application/json';
  postman.responseHeaders['x-powered-by'] = 'my cool web server';
  postman.responseHeaders['set-cookie'] = 'myCookie=hello';

  (() => {
    response.should.not.have.header('foo', 'bar');
  }).should.throw("expected header 'foo' to not have value 'bar'");

  (() => {
    response.should.have.header('foo', 'zzzzz');
  }).should.throw("expected header 'foo' to have value 'zzzzz'");

  (() => {
    expect(response).not.to.have.header('Set-Cookie', 'myCookie=hello');
  }).should.throw("expected header 'Set-Cookie' to not have value 'myCookie=hello'");

  (() => {
    expect(response).to.have.header('Set-Cookie', 'someOtherCookie=goodbye');
  }).should.throw("expected header 'Set-Cookie' to have value 'someOtherCookie=goodbye'");

  (() => {
    response.should.not.have.header('X-POWERED-BY', /^my (\w+ )+server$/);
  }).should.throw("expected header 'X-POWERED-BY' to not match /^my (\\w+ )+server$/");

  (() => {
    expect(response).to.have.header('x-powered-by', /^my awesome server$/);
  }).should.throw("expected header 'x-powered-by' to match /^my awesome server$/");

  (() => {
    expect(response).to.have.header('xyz', /^some expression$/);
  }).should.throw("expected header 'xyz' to match /^some expression$/ but got '<header-not-set>'");

  t.end();
});

test('json assertion (pass)', (t) => {
  let postman = new Postman(t);

  response.should.not.be.json;

  postman.responseHeaders['content-type'] = 'application/json; charset=utf-8';

  response.should.be.json;
  expect(response).to.be.json;

  response.should.not.be.html;
  expect(response).not.to.be.text;

  postman.responseHeaders['content-type'] = 'application/hal+json; charset=utf-8';

  response.should.not.be.json;

  t.end();
});

test('json assertion (fail)', (t) => {
  let postman = new Postman(t);

  (() => {
    response.should.be.json;
  }).should.throw("expected the response type to be 'json' but got '<content-type-not-set>'");

  postman.responseHeaders['content-type'] = 'application/xml; charset=utf-8';

  (() => {
    expect(response).to.be.json;
  }).should.throw("expected the response type to be 'json' but got 'application/xml; charset=utf-8'");

  t.end();
});

test('html assertion (pass)', (t) => {
  let postman = new Postman(t);

  response.should.not.be.html;

  postman.responseHeaders['content-type'] = 'text/html; charset=utf-8';

  response.should.be.html;
  expect(response).to.be.html;

  response.should.not.be.json;
  expect(response).not.to.be.text;

  postman.responseHeaders['content-type'] = 'text/xhtml; charset=utf-8';

  response.should.not.be.html;

  t.end();
});

test('html assertion (fail)', (t) => {
  let postman = new Postman(t);

  (() => {
    response.should.be.html;
  }).should.throw("expected the response type to be 'html' but got '<content-type-not-set>'");

  postman.responseHeaders['content-type'] = 'application/xml; charset=utf-8';

  (() => {
    expect(response).to.be.html;
  }).should.throw("expected the response type to be 'html' but got 'application/xml; charset=utf-8'");

  t.end();
});

test('text assertion (pass)', (t) => {
  let postman = new Postman(t);

  response.should.not.be.text;

  postman.responseHeaders['content-type'] = 'text/plain; charset=utf-8';

  response.should.be.text;
  expect(response).to.be.text;

  response.should.not.be.json;
  expect(response).not.to.be.html;

  postman.responseHeaders['content-type'] = 'text/rtf; charset=utf-8';

  response.should.not.be.text;

  t.end();
});

test('text assertion (fail)', (t) => {
  let postman = new Postman(t);

  (() => {
    response.should.be.text;
  }).should.throw("expected the response type to be 'text' but got '<content-type-not-set>'");

  postman.responseHeaders['content-type'] = 'application/xml; charset=utf-8';

  (() => {
    expect(response).to.be.text;
  }).should.throw("expected the response type to be 'text' but got 'application/xml; charset=utf-8'");

  t.end();
});

// test('XXXXXXXXXXXXXXXXXX', (t) => {
//   let postman = new Postman(t);

//   // Redirect
//   response = { status: 200 };
//   response.should.not.redirect;

//   t.end();
// });

// test('XXXXXXXXXXXXXXXXXX', (t) => {
//   let postman = new Postman(t);

//   [301, 302, 303].forEach((status) => {
//     response = { status };
//     response.should.redirect;
//   });

//   t.end();
// });

// test('XXXXXXXXXXXXXXXXXX', (t) => {
//   let postman = new Postman(t);

//   ({
//     status: 200,
//     redirects: ['http://example.com']
//   }).should.redirect;

//   t.end();
// });

// test('XXXXXXXXXXXXXXXXXX', (t) => {
//   let postman = new Postman(t);

//   ({
//     status: 200,
//     redirects: []
//   }).should.not.redirect;

//   t.end();
// });

// test('XXXXXXXXXXXXXXXXXX', (t) => {
//   let postman = new Postman(t);

//   (() => {
//     response = { status: 200 };
//     response.should.redirect;
//   }).should.throw('expected redirect with 30{1-3} status code but got 200');

//   t.end();
// });

// test('XXXXXXXXXXXXXXXXXX', (t) => {
//   let postman = new Postman(t);

//   (() => {
//     response = { status: 301 };
//     response.should.not.redirect;
//   }).should.throw('expected not to redirect but got 301 status');

//   t.end();
// });

// test('XXXXXXXXXXXXXXXXXX', (t) => {
//   let postman = new Postman(t);

//   // RedirectTo
//   response = { status: 301, headers: { location: 'foo' } };
//   response.should.redirectTo('foo');

//   response = { status: 301, headers: { location: 'bar' } };
//   response.should.not.redirectTo('foo');

//   response = { status: 200, redirects: ['bar'] };
//   response.should.redirectTo('bar');

//   response = { status: 200, redirects: ['bar'] };
//   response.should.not.redirectTo('foo');

//   t.end();
// });

// test('XXXXXXXXXXXXXXXXXX', (t) => {
//   let postman = new Postman(t);

//   (() => {
//     response = { status: 301, headers: { location: 'foo' } };
//     response.should.not.redirectTo('foo');
//   }).should.throw('expected header 'location' to not have value foo');

//   t.end();
// });

// test('XXXXXXXXXXXXXXXXXX', (t) => {
//   let postman = new Postman(t);

//   (() => {
//     response = { status: 301, headers: { location: 'bar' } };
//     response.should.redirectTo('foo');
//   }).should.throw('expected header 'location' to have value foo');

//   t.end();
// });

// test('XXXXXXXXXXXXXXXXXX', (t) => {
//   let postman = new Postman(t);

//   (() => {
//     response = { status: 200, redirects: ['bar', 'baz'] };
//     response.should.redirectTo('foo');
//   }).should.throw('expected redirect to foo but got bar then baz');

//   t.end();
// });

// test('XXXXXXXXXXXXXXXXXX', (t) => {
//   let postman = new Postman(t);

//   // Param
//   req = { url: '/test?x=y&foo=bar' };
//   req.should.have.param('x');
//   req.should.have.param('foo');
//   req.should.have.param('x', 'y');
//   req.should.have.param('foo', 'bar');
//   req.should.not.have.param('bar');
//   req.should.not.have.param('y');
//   req.should.not.have.param('x', 'z');
//   req.should.not.have.param('foo', 'baz');

//   t.end();
// });

// test('XXXXXXXXXXXXXXXXXX', (t) => {
//   let postman = new Postman(t);

//   (() => {
//     req.should.not.have.param('foo');
//   }).should.throw(/expected .* to not have property 'foo'/);

//   t.end();
// });

// test('XXXXXXXXXXXXXXXXXX', (t) => {
//   let postman = new Postman(t);

//   (() => {
//     req.should.not.have.param('foo', 'bar');
//   }).should.throw(/expected .* to not have a property 'foo' of 'bar'/);

//   t.end();
// });

// test('XXXXXXXXXXXXXXXXXX', (t) => {
//   let postman = new Postman(t);

//   // Param (deep)
//   req = { url: '/test?form[name]=jim&form[lastName]=bob' };
//   req.should.have.param('form');
//   req.should.have.deep.param('form.name');
//   req.should.have.deep.param('form.name', 'jim');
//   req.should.have.deep.param('form.lastName');
//   req.should.have.deep.param('form.lastName', 'bob');
//   req.should.not.have.param('bar');
//   req.should.not.have.deep.param('form.bar');
//   req.should.not.have.deep.param('form.name', 'sue');

//   t.end();
// });

// test('XXXXXXXXXXXXXXXXXX', (t) => {
//   let postman = new Postman(t);

//   (() => {
//     req.should.not.have.deep.param('form.name');
//   }).should.throw(/expected .* to not have deep property 'form.name'/);

//   t.end();
// });

// test('XXXXXXXXXXXXXXXXXX', (t) => {
//   let postman = new Postman(t);

//   (() => {
//     req.should.not.have.deep.param('form.lastName', 'bob');
//   }).should.throw(/expected .* to not have a deep property 'form.lastName' of 'bob'/);

//   t.end();
// });

// test('XXXXXXXXXXXXXXXXXX', (t) => {
//   let postman = new Postman(t);

//   // Cookie
//   response = {
//     headers: {
//       'set-cookie': [
//         'name=value',
//         'name2=value2; Expires=Wed, 09 Jun 2021 10:18:14 GMT'
//       ]
//     }
//   };
//   response.should.have.cookie('name');
//   response.should.have.cookie('name2');
//   response.should.have.cookie('name', 'value');
//   response.should.have.cookie('name2', 'value2');
//   response.should.not.have.cookie('bar');
//   response.should.not.have.cookie('name2', 'bar');

//   t.end();
// });

// test('XXXXXXXXXXXXXXXXXX', (t) => {
//   let postman = new Postman(t);

//   (() => {
//     response.should.not.have.cookie('name');
//   }).should.throw('expected cookie 'name' to not exist');

//   t.end();
// });

// test('XXXXXXXXXXXXXXXXXX', (t) => {
//   let postman = new Postman(t);

//   (() => {
//     response.should.have.cookie('foo');
//   }).should.throw('expected cookie 'foo' to exist');

//   (() => {
//     response.should.not.have.cookie('name', 'value');
//   }).should.throw('expected cookie 'name' to not have value 'value'');

//   (() => {
//     response.should.have.cookie('name2', 'value');
//   }).should.throw('expected cookie 'name2' to have value 'value' but got 'value2'');

//   t.end();
// });

// test('XXXXXXXXXXXXXXXXXX', (t) => {
//   let postman = new Postman(t);

//   // Cookie (request)
//   req = {
//     headers: {
//       cookie: 'name=value;name2=value2;'
//     }
//   };
//   req.should.have.cookie('name');
//   req.should.have.cookie('name2');
//   req.should.have.cookie('name', 'value');
//   req.should.have.cookie('name2', 'value2');
//   req.should.not.have.cookie('bar');
//   req.should.not.have.cookie('name2', 'bar');

//   t.end();
// });

// test('XXXXXXXXXXXXXXXXXX', (t) => {
//   let postman = new Postman(t);

//   (() => {
//     req.should.not.have.cookie('name');
//   }).should.throw('expected cookie 'name' to not exist');

//   t.end();
// });

// test('XXXXXXXXXXXXXXXXXX', (t) => {
//   let postman = new Postman(t);

//   (() => {
//     req.should.have.cookie('foo');
//   }).should.throw('expected cookie 'foo' to exist');

//   t.end();
// });

// test('XXXXXXXXXXXXXXXXXX', (t) => {
//   let postman = new Postman(t);

//   (() => {
//     req.should.not.have.cookie('name', 'value');
//   }).should.throw('expected cookie 'name' to not have value 'value'');

//   t.end();
// });

// test('XXXXXXXXXXXXXXXXXX', (t) => {
//   let postman = new Postman(t);

//   (() => {
//     req.should.have.cookie('name2', 'value');
//   }).should.throw('expected cookie 'name2' to have value 'value' but got 'value2'');

//   t.end();
// });
