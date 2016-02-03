'use strict';

require('./_prelude');

// Postman BDD
require('./bdd');

// Allow users to set options
module.exports = require('./options');

// SuperAgent Response API
global.response = require('./response');

console.log('This: ' + typeof this);
console.log('Global: ' + typeof global);
console.log('Window: ' + typeof window);

// Chai
global.chai = require('chai');
global.chai.should();
global.assert = chai.assert;
global.expect = chai.expect;

// Chai-HTTP Assertions
var assertions = require('./assertions');
chai.use(assertions);
