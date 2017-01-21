// Disable "strict mode" for this file,
// so we can define variables with global scope
/* eslint strict:off */

// Postman BDD
postmanBDD = require('../');
postmanBDD.logLevel = 'silent';

// Postman's `tests` global
tests = {};

// Test Specs
require('./specs/describe.spec.js');
require('./specs/it.spec.js');
require('./specs/before.spec.js');
require('./specs/beforeEach.spec.js');
require('./specs/after.spec.js');
require('./specs/afterEach.spec.js');
require('./specs/assertions.spec.js');

console.log('All tests passed');
