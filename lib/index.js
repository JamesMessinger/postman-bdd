'use strict';

var globals = require('./globals');
require('./_prelude');

// Postman BDD
require('./bdd');

// SuperAgent Response API
globals.register('response', require('./response'));

// Chai
var chai = globals.register('chai', require('chai'));
globals.register('assert', chai.assert);
globals.register('expect', chai.expect);
chai.should();

// Chai-HTTP Assertions
var assertions = require('./assertions');
chai.use(assertions);

// Allow users to set options
module.exports = require('./options');
