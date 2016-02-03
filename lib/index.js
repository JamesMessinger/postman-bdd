'use strict';

require('./_prelude');

// Postman BDD
require('./bdd');

// Allow users to set options
module.exports = require('./options');

// Chai
var chai = require('chai');
chai.should();
global.assert = chai.assert;
global.expect = chai.expect;
