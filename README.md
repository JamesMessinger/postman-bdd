![Postman BDD](docs/logo.gif)

✨ Postman now has it's own BDD test syntax ✨
--------------------------
Postman-BDD is no longer necessary, because Postman now has its own BDD and fluent syntax built-in!

I recommend that you start using Postman's new test syntax instead of Postman-BDD.  However, if you want to continue using Postman-BDD, then you can find the [original ReadMe here](OLD_README.md).

### Docs
* [Test Scripts](https://www.getpostman.com/docs/v5/postman/scripts/test_scripts)
* [Test Examples](https://www.getpostman.com/docs/v5/postman/scripts/test_examples)

### Example
```javascript
// example using pm.response.to.have
pm.test("response is ok", () => {
    pm.response.to.have.status(200);
});

// example using pm.expect()
pm.test("environment to be production", () => {
    pm.expect(pm.environment.get("env")).to.equal("production");
});

// example using response assertions
pm.test("response should be okay to process", () => {
    pm.response.to.not.be.error;
    pm.response.to.have.jsonBody("");
    pm.response.to.not.have.jsonBody("error");
});

// example using pm.response.to.be*
pm.test("response must be valid and have a body", () => {
     // assert that the status code is 200
     pm.response.to.be.ok; // info, success, redirection, clientError,  serverError, are other variants
     // assert that the response has a valid JSON body
     pm.response.to.be.withBody;
     pm.response.to.be.json; // this assertion also checks if a body  exists, so the above check is not needed
});
```

### Migration Guide
Postman's new BDD and fluent syntax are a bit different from Postman-BDD.  Here are the changes you need to make to migrate your tests:

#### Remove `describe` blocks
`describe()` blocks were optional in Postman-BDD, and they don't exist at all in Postman's new syntax.  So just remove them.

#### Replace `it` blocks with `pm.test`
Postman-BDD used `it` blocks to define tests, such as:

```javascript
it('should return the correct customer', () => {
  // assertions here
});
```

Postman now has `pm.test` blocks, which work the same way.  For example:

```javascript
pm.test('returns the correct customer', () => {
  // assertions here
});
```

#### Move hooks to folder/collection scripts
Postman-BDD allowed you to define common assertions or setup/teardown logic in hooks, such as `before()`, `after()`, `beforeEach()` and `afterEach()`.  This is no longer necessary because Postman now allows you to [define test scripts for folders and collections](https://www.getpostman.com/docs/v6/postman/scripts/test_scripts#adding-a-test-script-to-a-collection-or-folder).

#### Different assertion syntax
Postman-BDD used the [Chai.js](http://www.chaijs.com/api/bdd/) and [Chai-HTTP](http://www.chaijs.com/plugins/chai-http/#assertions) assertion libraries, which let you write assertions using an intuitive, fluent, English-like syntax.

```javascript
it('should return a 200 response', () => {
  response.should.have.status(200);
});

it('should set the Location header', () => {
  response.should.have.header('Location');
});

it('should return a JSON response', () => {
  response.should.be.json;
});

it('should return the correct customer', () => {
  response.body.should.have.property('id', 12345);
});
```

Postman now supports its own fluent assertion syntax, which is somewhat similar.

```javascript
pm.test('returns a 200 response', () => {
  pm.response.to.have.status(200);
});

pm.test('sets the Location header', () => {
  pm.response.to.have.header("Location");
});

pm.test('returns a JSON response', () => {
  pm.response.to.be.json;
});

pm.test('returns the correct customer', () => {
  let jsonData = pm.response.json();
  pm.expect(jsonData.id).to.eql(12345);
});
```
