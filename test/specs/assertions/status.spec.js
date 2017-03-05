'use strict';

const test = require('tape');
const Postman = require('../../fixtures/postman');

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
