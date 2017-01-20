// Postman BDD
require('./bdd');

// Allow users to set options
module.exports = require('./options');

// SuperAgent Response API
response = require('./response');

// Chai
chai = require('chai');
assert = chai.assert;
expect = chai.expect;
chai.should();

// Chai-HTTP Assertions
var assertions = require('./assertions');
chai.use(assertions);
