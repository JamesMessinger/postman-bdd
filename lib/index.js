'use strict';

require('./_prelude');

// Postman BDD
require('./bdd');

// Allow users to set options
module.exports = require('./options');

// Chai
global.chai = require('chai');
global.chai.should();
global.assert = chai.assert;
global.expect = chai.expect;

// Chai-HTTP Assertions
var assertions = require('./assertions');
chai.use(assertions);
