// 'use strict';

// const test = require('tape');
// const Postman = require('../fixtures/postman');

// test('XXXXXXXXXXXXXXXXXX', (t) => {
//   let postman = new Postman(t);

//   let req, res;

//   // Status
//   res = { status: 200 };
//   res.should.to.have.status(200);

//   t.end();
// });

// test('XXXXXXXXXXXXXXXXXX', (t) => {
//   let postman = new Postman(t);

//   (function () {
//     res.should.not.have.status(200);
//   }).should.throw('expected { status: 200 } to not have status code 200');

//   t.end();
// });

// test('XXXXXXXXXXXXXXXXXX', (t) => {
//   let postman = new Postman(t);

//   (function () {
//     ({}).should.not.to.have.status(200);
//   }).should.throw('expected {} to have a property \'status\'');

//   t.end();
// });

// test('XXXXXXXXXXXXXXXXXX', (t) => {
//   let postman = new Postman(t);

//   // IP
//   '127.0.0.1'.should.be.an.ip;
//   '2001:0db8:85a3:0000:0000:8a2e:0370:7334'.should.be.an.ip;

//   t.end();
// });

// test('XXXXXXXXXXXXXXXXXX', (t) => {
//   let postman = new Postman(t);

//   (function () {
//     '127.0.0.1'.should.not.be.an.ip;
//   }).should.throw('expected \'127.0.0.1\' to not be an ip');

//   t.end();
// });

// test('XXXXXXXXXXXXXXXXXX', (t) => {
//   let postman = new Postman(t);

//   (function () {
//     '2001:0db8:85a3:0000:0000:8a2e:0370:7334'.should.not.be.an.ip;
//   }).should.throw('expected \'2001:0db8:85a3:0000:0000:8a2e:0370:7334\' to not be an ip');

//   t.end();
// });

// test('XXXXXXXXXXXXXXXXXX', (t) => {
//   let postman = new Postman(t);

//   // Header (existence)
//   req = { headers: { foo: 'bar' } };
//   res = {
//     getHeader(key) {
//       return key === 'foo' ? 'bar' : undefined;
//     }
//   };

//   t.end();
// });

// test('XXXXXXXXXXXXXXXXXX', (t) => {
//   let postman = new Postman(t);

//   req.should.have.header('foo');
//   req.should.not.have.header('bar');

//   t.end();
// });

// test('XXXXXXXXXXXXXXXXXX', (t) => {
//   let postman = new Postman(t);

//   res.should.have.header('foo');
//   res.should.not.have.header('bar');

//   t.end();
// });

// test('XXXXXXXXXXXXXXXXXX', (t) => {
//   let postman = new Postman(t);

//   (function () {
//     req.should.have.header('bar');
//   }).should.throw('expected header \'bar\' to exist');

//   t.end();
// });

// test('XXXXXXXXXXXXXXXXXX', (t) => {
//   let postman = new Postman(t);

//   (function () {
//     res.should.have.header('bar');
//   }).should.throw('expected header \'bar\' to exist');

//   t.end();
// });

// test('XXXXXXXXXXXXXXXXXX', (t) => {
//   let postman = new Postman(t);

//   // Header (value)
//   req = { headers: { foo: 'bar' } };
//   res = {
//     getHeader() {
//       return 'foo';
//     }
//   };

//   t.end();
// });

// test('XXXXXXXXXXXXXXXXXX', (t) => {
//   let postman = new Postman(t);

//   req.should.have.header('foo', 'bar');
//   res.should.have.header('bar', 'foo');
//   res.should.have.header('bar', /^fo/);

//   t.end();
// });

// test('XXXXXXXXXXXXXXXXXX', (t) => {
//   let postman = new Postman(t);

//   (function () {
//     req.should.not.have.header('foo', 'bar');
//   }, 'expected header \'foo\' to not have value bar');

//   t.end();
// });

// test('XXXXXXXXXXXXXXXXXX', (t) => {
//   let postman = new Postman(t);

//   (function () {
//     res.should.not.have.header('bar', 'foo');
//   }).should.throw('expected header \'bar\' to not have value foo');

//   t.end();
// });

// test('XXXXXXXXXXXXXXXXXX', (t) => {
//   let postman = new Postman(t);

//   (function () {
//     res.should.not.have.header('bar', /^fo/);
//   }).should.throw('expected header \'bar\' not to match /^fo/ but got \'foo\'');

//   t.end();
// });

// test('XXXXXXXXXXXXXXXXXX', (t) => {
//   let postman = new Postman(t);

//   // Header (case insensitive)
//   req = { headers: { foo: 'bar' } };
//   res = {
//     getHeader() {
//       return 'foo';
//     }
//   };

//   t.end();
// });

// test('XXXXXXXXXXXXXXXXXX', (t) => {
//   let postman = new Postman(t);

//   res.should.have.header('Foo');
//   res.should.have.header('Bar');
//   req.should.have.header('FoO', 'bar');
//   res.should.have.header('BAr', 'foo');

//   t.end();
// });

// test('XXXXXXXXXXXXXXXXXX', (t) => {
//   let postman = new Postman(t);

//   // Headers
//   req = { headers: { foo: 'bar' } };
//   res = {
//     getHeader() {
//       return 'foo';
//     }
//   };

//   t.end();
// });

// test('XXXXXXXXXXXXXXXXXX', (t) => {
//   let postman = new Postman(t);

//   req.should.have.headers;
//   res.should.have.headers;

//   t.end();
// });

// test('XXXXXXXXXXXXXXXXXX', (t) => {
//   let postman = new Postman(t);

//   (function () {
//     req.should.not.have.headers;
//   }).should.throw('expected { headers: { foo: \'bar\' } } to not have headers or getHeader method');

//   t.end();
// });

// test('XXXXXXXXXXXXXXXXXX', (t) => {
//   let postman = new Postman(t);

//   (function () {
//     res.should.not.have.headers;
//   }).should.throw(/expected .*getHeader.* to not have headers or getHeader method/);

//   t.end();
// });

// test('XXXXXXXXXXXXXXXXXX', (t) => {
//   let postman = new Postman(t);

//   // JSON
//   req = { headers: { 'content-type': ['application/json'] } };
//   res = {
//     getHeader() {
//       return 'application/json';
//     }
//   };

//   t.end();
// });

// test('XXXXXXXXXXXXXXXXXX', (t) => {
//   let postman = new Postman(t);

//   req.should.be.json;
//   res.should.be.json;

//   t.end();
// });

// test('XXXXXXXXXXXXXXXXXX', (t) => {
//   let postman = new Postman(t);

//   (function () {
//     req.should.not.be.json;
//   }).should.throw('expected [ \'application/json\' ] to not include \'application/json\'');

//   t.end();
// });

// test('XXXXXXXXXXXXXXXXXX', (t) => {
//   let postman = new Postman(t);

//   (function () {
//     res.should.not.be.json;
//   }).should.throw('expected \'application/json\' to not include \'application/json\'');

//   t.end();
// });

// test('XXXXXXXXXXXXXXXXXX', (t) => {
//   let postman = new Postman(t);

//   // Text
//   req = { headers: { 'content-type': ['text/plain'] } };
//   res = {
//     getHeader() {
//       return 'text/plain';
//     }
//   };

//   t.end();
// });

// test('XXXXXXXXXXXXXXXXXX', (t) => {
//   let postman = new Postman(t);

//   req.should.be.text;
//   res.should.be.text;

//   t.end();
// });

// test('XXXXXXXXXXXXXXXXXX', (t) => {
//   let postman = new Postman(t);

//   (function () {
//     req.should.not.be.text;
//   }).should.throw('expected [ \'text/plain\' ] to not include \'text/plain\'');

//   t.end();
// });

// test('XXXXXXXXXXXXXXXXXX', (t) => {
//   let postman = new Postman(t);

//   (function () {
//     res.should.not.be.text;
//   }).should.throw('expected \'text/plain\' to not include \'text/plain\'');

//   t.end();
// });

// test('XXXXXXXXXXXXXXXXXX', (t) => {
//   let postman = new Postman(t);

//   // HTML
//   req = { headers: { 'content-type': ['text/html'] } };
//   res = {
//     getHeader() {
//       return 'text/html';
//     }
//   };

//   t.end();
// });

// test('XXXXXXXXXXXXXXXXXX', (t) => {
//   let postman = new Postman(t);

//   req.should.be.html;
//   res.should.be.html;

//   t.end();
// });

// test('XXXXXXXXXXXXXXXXXX', (t) => {
//   let postman = new Postman(t);

//   (function () {
//     req.should.not.be.html;
//   }).should.throw('expected [ \'text/html\' ] to not include \'text/html\'');

//   t.end();
// });

// test('XXXXXXXXXXXXXXXXXX', (t) => {
//   let postman = new Postman(t);

//   (function () {
//     res.should.not.be.html;
//   }).should.throw('expected \'text/html\' to not include \'text/html\'');

//   t.end();
// });

// test('XXXXXXXXXXXXXXXXXX', (t) => {
//   let postman = new Postman(t);

//   // Redirect
//   res = { status: 200 };
//   res.should.not.redirect;

//   t.end();
// });

// test('XXXXXXXXXXXXXXXXXX', (t) => {
//   let postman = new Postman(t);

//   [301, 302, 303].forEach((status) => {
//     res = { status };
//     res.should.redirect;
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

//   (function () {
//     res = { status: 200 };
//     res.should.redirect;
//   }).should.throw('expected redirect with 30{1-3} status code but got 200');

//   t.end();
// });

// test('XXXXXXXXXXXXXXXXXX', (t) => {
//   let postman = new Postman(t);

//   (function () {
//     res = { status: 301 };
//     res.should.not.redirect;
//   }).should.throw('expected not to redirect but got 301 status');

//   t.end();
// });

// test('XXXXXXXXXXXXXXXXXX', (t) => {
//   let postman = new Postman(t);

//   // RedirectTo
//   res = { status: 301, headers: { location: 'foo' } };
//   res.should.redirectTo('foo');

//   res = { status: 301, headers: { location: 'bar' } };
//   res.should.not.redirectTo('foo');

//   res = { status: 200, redirects: ['bar'] };
//   res.should.redirectTo('bar');

//   res = { status: 200, redirects: ['bar'] };
//   res.should.not.redirectTo('foo');

//   t.end();
// });

// test('XXXXXXXXXXXXXXXXXX', (t) => {
//   let postman = new Postman(t);

//   (function () {
//     res = { status: 301, headers: { location: 'foo' } };
//     res.should.not.redirectTo('foo');
//   }).should.throw('expected header \'location\' to not have value foo');

//   t.end();
// });

// test('XXXXXXXXXXXXXXXXXX', (t) => {
//   let postman = new Postman(t);

//   (function () {
//     res = { status: 301, headers: { location: 'bar' } };
//     res.should.redirectTo('foo');
//   }).should.throw('expected header \'location\' to have value foo');

//   t.end();
// });

// test('XXXXXXXXXXXXXXXXXX', (t) => {
//   let postman = new Postman(t);

//   (function () {
//     res = { status: 200, redirects: ['bar', 'baz'] };
//     res.should.redirectTo('foo');
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

//   (function () {
//     req.should.not.have.param('foo');
//   }).should.throw(/expected .* to not have property \'foo\'/);

//   t.end();
// });

// test('XXXXXXXXXXXXXXXXXX', (t) => {
//   let postman = new Postman(t);

//   (function () {
//     req.should.not.have.param('foo', 'bar');
//   }).should.throw(/expected .* to not have a property \'foo\' of \'bar\'/);

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

//   (function () {
//     req.should.not.have.deep.param('form.name');
//   }).should.throw(/expected .* to not have deep property \'form.name\'/);

//   t.end();
// });

// test('XXXXXXXXXXXXXXXXXX', (t) => {
//   let postman = new Postman(t);

//   (function () {
//     req.should.not.have.deep.param('form.lastName', 'bob');
//   }).should.throw(/expected .* to not have a deep property \'form.lastName\' of \'bob\'/);

//   t.end();
// });

// test('XXXXXXXXXXXXXXXXXX', (t) => {
//   let postman = new Postman(t);

//   // Cookie
//   res = {
//     headers: {
//       'set-cookie': [
//         'name=value',
//         'name2=value2; Expires=Wed, 09 Jun 2021 10:18:14 GMT'
//       ]
//     }
//   };
//   res.should.have.cookie('name');
//   res.should.have.cookie('name2');
//   res.should.have.cookie('name', 'value');
//   res.should.have.cookie('name2', 'value2');
//   res.should.not.have.cookie('bar');
//   res.should.not.have.cookie('name2', 'bar');

//   t.end();
// });

// test('XXXXXXXXXXXXXXXXXX', (t) => {
//   let postman = new Postman(t);

//   (function () {
//     res.should.not.have.cookie('name');
//   }).should.throw('expected cookie \'name\' to not exist');

//   t.end();
// });

// test('XXXXXXXXXXXXXXXXXX', (t) => {
//   let postman = new Postman(t);

//   (function () {
//     res.should.have.cookie('foo');
//   }).should.throw('expected cookie \'foo\' to exist');

//   (function () {
//     res.should.not.have.cookie('name', 'value');
//   }).should.throw('expected cookie \'name\' to not have value \'value\'');

//   (function () {
//     res.should.have.cookie('name2', 'value');
//   }).should.throw('expected cookie \'name2\' to have value \'value\' but got \'value2\'');

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

//   (function () {
//     req.should.not.have.cookie('name');
//   }).should.throw('expected cookie \'name\' to not exist');

//   t.end();
// });

// test('XXXXXXXXXXXXXXXXXX', (t) => {
//   let postman = new Postman(t);

//   (function () {
//     req.should.have.cookie('foo');
//   }).should.throw('expected cookie \'foo\' to exist');

//   t.end();
// });

// test('XXXXXXXXXXXXXXXXXX', (t) => {
//   let postman = new Postman(t);

//   (function () {
//     req.should.not.have.cookie('name', 'value');
//   }).should.throw('expected cookie \'name\' to not have value \'value\'');

//   t.end();
// });

// test('XXXXXXXXXXXXXXXXXX', (t) => {
//   let postman = new Postman(t);

//   (function () {
//     req.should.have.cookie('name2', 'value');
//   }).should.throw('expected cookie \'name2\' to have value \'value\' but got \'value2\'');

//   t.end();
// });
