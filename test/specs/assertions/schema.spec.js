'use strict';

const test = require('tape');
const Postman = require('../../fixtures/postman');

test('JSON schema assertion with empty body', (t) => {
  new Postman(t);   // eslint-disable-line no-new

  t.doesNotThrow(() => {
    response.body.should.have.schema({ type: 'string', maxLength: 0 });

    expect(response.body).not.to.have.schema({ type: 'string', minLength: 25 });
  });

  t.throws(() =>
    response.body.should.have.schema({ type: 'object' }),
    /Invalid type: string \(expected object\)/
  );

  t.throws(() =>
    response.body.should.have.schema({ type: 'string', minLength: 25 }),
    /String is too short \(0 chars\)/
  );

  t.end();
});

test('JSON schema assertion without Content-Type header', (t) => {
  let postman = new Postman(t);

  postman.responseBody = 'hello world';

  t.doesNotThrow(() => {
    response.body.should.have.schema({ type: 'string', minLength: 10 });
    expect(response.body).to.have.schema({ type: 'string' });
  });

  t.throws(() =>
    response.body.should.have.schema({ type: 'object' }),
    /Invalid type: string \(expected object\)/
  );

  t.end();
});

test('JSON schema assertion with XML content', (t) => {
  let postman = new Postman(t);

  postman.responseHeaders['content-type'] = 'text/xml';
  postman.responseBody = '<person><name>John Doe</name><age>35</age></person>';

  t.doesNotThrow(() => {
    response.body.should.have.schema({
      type: 'object',
      required: ['person'],
      properties: {
        person: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              minLength: 1,
            }
          }
        }
      }
    });
  });

  t.throws(() =>
    response.body.should.have.schema({ type: 'string' }),
    /Invalid type: object \(expected string\)/
  );

  t.end();
});

test('JSON schema assertion (pass)', (t) => {
  let postman = new Postman(t);

  postman.responseHeaders['content-type'] = 'application/json';
  postman.responseBody = '{"name":"John Doe","age":35}';

  let jsonSchema = {
    type: 'object',
    required: ['name', 'age'],
    properties: {
      name: {
        type: 'string',
        minLength: 1,
      },
      age: {
        type: 'integer',
        minimum: 1,
        maximum: 100
      },
    },
  };

  t.doesNotThrow(() => {
    response.body.should.have.schema(jsonSchema);
    expect(response.body).to.have.schema(jsonSchema);
  });

  t.end();
});

test('JSON schema assertion (fail)', (t) => {
  let postman = new Postman(t);

  postman.responseHeaders['content-type'] = 'application/hal+json';
  postman.responseBody = '{"name":"","age":999,"address":{"street":{}}}';

  t.throws(() =>
    response.body.should.have.schema({
      type: 'object',
      properties: {
        name: {
          type: 'string',
          minLength: 1,
        },
      },
    }),
    /name is invalid. String is too short \(0 chars\), minimum 1/
  );

  t.throws(() =>
    response.body.should.have.schema({
      type: 'object',
      properties: {
        age: {
          type: 'integer',
          minimum: 1,
          maximum: 100
        },
      },
    }),
    /age is invalid. Value 999 is greater than maximum 100/
  );

  t.throws(() =>
    response.body.should.have.schema({
      type: 'object',
      required: ['name', 'age', 'occupation'],
    }),
    /Missing required property: occupation/
  );

  t.throws(() =>
    response.body.should.have.schema({
      type: 'object',
      properties: {
        address: {
          type: 'object',
          required: ['street', 'city', 'state', 'zip']
        }
      },
    }),
    /address is invalid. Missing required property: city/
  );

  t.throws(() =>
    response.body.should.have.schema({
      type: 'object',
      properties: {
        address: {
          type: 'object',
          properties: {
            street: {
              type: 'object',
              required: ['line1', 'line2']
            }
          }
        }
      },
    }),
    /address.street is invalid. Missing required property: line1/
  );

  t.end();
});
