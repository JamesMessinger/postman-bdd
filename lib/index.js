'use strict';

require('./_prelude');

// Postman BDD
require('./bdd');

// Postman BDD global
var globals = require('./globals');
globals.register('postmanBDD', globals.restore);

// Allow users to set options
module.exports = require('./options');

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
