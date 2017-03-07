'use strict';

const test = require('tape');
const Postman = require('../../fixtures/postman');

test('ip assertion supports IPv4', (t) => {
  new Postman(t);

  t.doesNotThrow(() => {
    '127.0.0.1'.should.be.an.ip;
    expect('127.0.0.1').to.be.an.ip;

    '156.64.86.2'.should.be.an.ip;
    expect('0.0.0.0').to.be.an.ip;

    '999.999.999.999'.should.not.be.an.ip;
  });

  t.throws(() =>
    '127.0.0.1'.should.not.be.an.ip,
    /expected '127.0.0.1' to not be an ip/
  );

  t.throws(() =>
    '127.0.0.1'.should.not.be.an.ip,
    /expected '127.0.0.1' to not be an ip/
  );

  t.end();
});

test('ip assertion supports IPv6', (t) => {
  new Postman(t);

  t.doesNotThrow(() => {
    '2001:0db8:85a3:0000:0000:8a2e:0370:7334'.should.be.an.ip;
    expect('2001:0db8:85a3:0000:0000:8a2e:0370:7334').to.be.an.ip;
  });

  t.throws(() =>
    expect('2001:0db8:85a3:0000:0000:8a2e:0370:7334').not.to.be.an.ip,
    /expected '2001:0db8:85a3:0000:0000:8a2e:0370:7334' to not be an ip/
  );

  t.end();
});

test('ip assertion (invalid)', (t) => {
  new Postman(t);

  t.doesNotThrow(() => {
    'hello world'.should.not.be.an.ip;
    expect(123456789).not.to.be.an.ip;
    expect('123456789').not.to.be.an.ip;
  });

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

  t.end();
});
