'use strict';

const test = require('tape');
const Postman = require('../../fixtures/postman');

test('JSON response body', (t) => {
  new Postman(t, {
    responseHeaders: {
      'content-type': 'application/json',
    },
    responseBody: `
      {
        "name": "John Doe",
        "age": 35,
        "address": {
          "city": "San Francisco",
          "state": "CA"
        }
      }
    `,
  });

  t.doesNotThrow(() => {
    response.should.be.json;

    response.body.name.should.equal('John Doe');

    expect(response.body).to.have.keys(['name', 'age', 'address']);

    response.body.age.should.be.above(30).and.below(40);

    expect(response.body.address.city).to.match(/^San/);
  });

  t.end();
});

test('XML response body', (t) => {
  new Postman(t, {
    responseHeaders: {
      'content-type': 'application/xml',
    },
    responseBody: `
      <person>
        <name>John Doe</name>
        <age>35</age>
        <address>
          <city>San Francisco</city>
          <state>CA</state>
        </address>
      </person>
    `,
  });

  t.doesNotThrow(() => {
    response.should.be.xml;

    response.body.person.name.should.equal('John Doe');

    expect(response.body.person).to.have.keys(['name', 'age', 'address']);

    response.body.person.age.should.be.above(30).and.below(40);

    expect(response.body.person.address.city).to.match(/^San/);
  });

  t.end();
});
