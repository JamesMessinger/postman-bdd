'use strict';

require('./_prelude');

// Postman BDD
require('./bdd');

// Chai
var chai = require('chai');
chai.should();
global.assert = chai.assert;
global.expect = chai.expect;
