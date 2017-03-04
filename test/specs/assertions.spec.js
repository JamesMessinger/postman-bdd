'use strict';

const test = require('tape');
const Postman = require('../fixtures/postman');

test('status assertion (pass)', (t) => {
  let postman = new Postman(t);
  postman.responseCode.code = 200;

  t.doesNotThrow(() => {
    expect(response).to.have.status(200);
    response.should.have.status(200);

    expect(response).not.to.have.status(404);
    response.should.not.have.status(404);
  });

  t.end();
});

test('status assertion (fail)', (t) => {
  let postman = new Postman(t);
  postman.responseCode.code = 200;

  t.throws(() =>
    response.should.have.status(404),
    /expected the response to have status code 404 but got 200/
  );

  t.throws(() =>
    expect(response).to.have.status(404),
    /expected the response to have status code 404/
  );

  t.throws(() =>
    response.should.not.have.status(200),
    /expected the response to not have status code 200/
  );

  t.throws(() =>
    expect(response).not.to.have.status(200),
    /expected the response to not have status code 200/
  );

  t.end();
});

test('ip assertion (pass)', (t) => {
  new Postman(t);   // eslint-disable-line no-new

  t.doesNotThrow(() => {
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
  });

  t.end();
});

test('ip assertion (fail)', (t) => {
  new Postman(t);   // eslint-disable-line no-new

  t.throws(() =>
    'hello world'.should.be.an.ip,
    /expected 'hello world' to be an ip/
  );

  t.throws(() =>
    expect('123456789').to.be.an.ip,
    /expected '123456789' to be an ip/
  );

  t.throws(() =>
    expect(123456789).to.be.an.ip,
    /expected 123456789 to be an ip/
  );

  t.throws(() =>
    '127.0.0.1'.should.not.be.an.ip,
    /expected '127.0.0.1' to not be an ip/
  );

  t.throws(() =>
    expect('2001:0db8:85a3:0000:0000:8a2e:0370:7334').not.to.be.an.ip,
    /expected '2001:0db8:85a3:0000:0000:8a2e:0370:7334' to not be an ip/
  );

  t.end();
});

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

test('html assertion (pass)', (t) => {
  let postman = new Postman(t);

  t.doesNotThrow(() => {
    response.should.not.be.html;
  });

  postman.responseHeaders['content-type'] = 'text/html; charset=utf-8';

  t.doesNotThrow(() => {
    response.should.be.html;
    expect(response).to.be.html;

    response.should.not.be.json;
    expect(response).not.to.be.text;
  });

  postman.responseHeaders['content-type'] = 'text/xhtml; charset=utf-8';

  t.doesNotThrow(() => {
    response.should.not.be.html;
  });

  t.end();
});

test('html assertion (fail)', (t) => {
  let postman = new Postman(t);

  t.throws(() =>
    response.should.be.html,
    /expected the response type to be 'html' but got '<content-type-not-set>'/
  );

  postman.responseHeaders['content-type'] = 'application/xml; charset=utf-8';

  t.throws(() =>
    expect(response).to.be.html,
    /expected the response type to be 'html' but got 'application\/xml; charset=utf-8'/
  );

  t.end();
});

test('text assertion (pass)', (t) => {
  let postman = new Postman(t);

  t.doesNotThrow(() => {
    response.should.not.be.text;
  });

  postman.responseHeaders['content-type'] = 'text/plain; charset=utf-8';

  t.doesNotThrow(() => {
    response.should.be.text;
    expect(response).to.be.text;

    response.should.not.be.json;
    expect(response).not.to.be.html;
  });

  postman.responseHeaders['content-type'] = 'text/rtf; charset=utf-8';

  t.doesNotThrow(() => {
    response.should.not.be.text;
  });

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

test('text assertion (fail)', (t) => {
  let postman = new Postman(t);

  t.throws(() =>
    response.should.be.text,
    /expected the response type to be 'text' but got '<content-type-not-set>'/
  );

  postman.responseHeaders['content-type'] = 'application/xml; charset=utf-8';

  t.throws(() =>
    expect(response).to.be.text,
    /expected the response type to be 'text' but got 'application\/xml; charset=utf-8'/
  );

  t.end();
});

const nonRedirectCodes = [200, 201, 400, 404, 500];
const redirectCodes = [301, 302, 303, 307, 308];

test('redirect assertion (pass)', (t) => {
  let postman = new Postman(t);

  t.doesNotThrow(() => {
    response.should.not.redirect;
  });

  for (let code of nonRedirectCodes) {
    postman.responseCode.code = code;

    t.doesNotThrow(() => {
      response.should.not.redirect;
    }, `HTTP ${code} is not a redirect`);
  }

  for (let code of redirectCodes) {
    postman.responseCode.code = code;

    t.doesNotThrow(() => {
      response.should.redirect;
      expect(response).to.redirect;
    }, `HTTP ${code} is a redirect`);
  }

  t.end();
});

test('redirect assertion (fail)', (t) => {
  let postman = new Postman(t);

  t.throws(() =>
    response.should.redirect,
    /expected redirect status code but got 0/
  );

  for (let code of nonRedirectCodes) {
    postman.responseCode.code = code;

    t.throws(() =>
      response.should.redirect,
      new RegExp(`expected redirect status code but got ${code}`)
    );
  }

  for (let code of redirectCodes) {
    postman.responseCode.code = code;

    t.throws(() =>
      response.should.not.redirect,
      new RegExp(`expected not to redirect but got ${code} status`)
    );
  }

  t.end();
});

test('redirectTo assertion (pass)', (t) => {
  let postman = new Postman(t);

  t.doesNotThrow(() => {
    response.should.not.redirectTo('http://foo.com/bar/baz');
  });

  for (let code of nonRedirectCodes) {
    postman.responseCode.code = code;
    postman.responseHeaders.location = 'http://foo.com/bar/baz';

    t.doesNotThrow(() => {
      response.should.not.redirect;
      response.should.not.redirectTo('http://foo.com/bar/baz');
      expect(response).not.to.redirectTo('http://foo.com');
      response.should.not.redirectTo('/bar/baz');
    });
  }

  for (let code of redirectCodes) {
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

  for (let code of nonRedirectCodes) {
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

  for (let code of redirectCodes) {
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

//   t.throws(() =>
//     req.should.not.have.param('foo');
//   }).should.throw(/expected .* to not have property 'foo'/);

//   t.end();
// });

// test('XXXXXXXXXXXXXXXXXX', (t) => {
//   let postman = new Postman(t);

//   t.throws(() =>
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

//   t.throws(() =>
//     req.should.not.have.deep.param('form.name');
//   }).should.throw(/expected .* to not have deep property 'form.name'/);

//   t.end();
// });

// test('XXXXXXXXXXXXXXXXXX', (t) => {
//   let postman = new Postman(t);

//   t.throws(() =>
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

//   t.throws(() =>
//     response.should.not.have.cookie('name');
//   }).should.throw('expected cookie 'name' to not exist');

//   t.end();
// });

// test('XXXXXXXXXXXXXXXXXX', (t) => {
//   let postman = new Postman(t);

//   t.throws(() =>
//     response.should.have.cookie('foo');
//   }).should.throw('expected cookie 'foo' to exist');

//   t.throws(() =>
//     response.should.not.have.cookie('name', 'value');
//   }).should.throw('expected cookie 'name' to not have value 'value'');

//   t.throws(() =>
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

//   t.throws(() =>
//     req.should.not.have.cookie('name');
//   }).should.throw('expected cookie 'name' to not exist');

//   t.end();
// });

// test('XXXXXXXXXXXXXXXXXX', (t) => {
//   let postman = new Postman(t);

//   t.throws(() =>
//     req.should.have.cookie('foo');
//   }).should.throw('expected cookie 'foo' to exist');

//   t.end();
// });

// test('XXXXXXXXXXXXXXXXXX', (t) => {
//   let postman = new Postman(t);

//   t.throws(() =>
//     req.should.not.have.cookie('name', 'value');
//   }).should.throw('expected cookie 'name' to not have value 'value'');

//   t.end();
// });

// test('XXXXXXXXXXXXXXXXXX', (t) => {
//   let postman = new Postman(t);

//   t.throws(() =>
//     req.should.have.cookie('name2', 'value');
//   }).should.throw('expected cookie 'name2' to have value 'value' but got 'value2'');

//   t.end();
// });
