'use strict';

// Postman BDD
var postmanBDD = require('../');
postmanBDD.debug = false;

// Tests
require('./specs/describe.spec.js');
require('./specs/it.spec.js');
require('./specs/before.spec.js');
require('./specs/beforeEach.spec.js');
require('./specs/after.spec.js');
require('./specs/afterEach.spec.js');

console.log('All tests passed');
