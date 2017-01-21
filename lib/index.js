// Disable "strict mode" for this file,
// so we can define variables with global scope
/* eslint strict:off */

var PostmanBDD = require('./bdd');
var SuperAgent = require('./response');
var assertions = require('./assertions');
var options = require('./options');
var log = require('./log');

// Expose the Postman BDD options
module.exports = options;

// Expose a `reset()` method for testing purposes
module.exports.reset = initPostmanBDD;

// Initialize Postman BDD
initPostmanBDD();

/**
 * Defines (or redefines) all Postman BDD globals
 */
function initPostmanBDD () {
  log.info('Using Postman BDD');
  initBDD();
  initSuperAgent();
  initChai();
}

/**
 * Defines (or redefines) BDD globals
 */
function initBDD () {
  var postmanBDD = new PostmanBDD();
  before = postmanBDD.before;
  after = postmanBDD.after;
  beforeEach = postmanBDD.beforeEach;
  afterEach = postmanBDD.afterEach;
  describe = postmanBDD.describe;
  it = postmanBDD.it;
}

/**
 * Defines (or redefines) SuperAgent globals
 */
function initSuperAgent () {
  var superAgent = new SuperAgent();
  response = superAgent.response;
}

/**
 * Defines (or redefines) Chai.js globals
 */
function initChai () {
  chai = require('chai');
  assert = chai.assert;
  expect = chai.expect;
  chai.should();

  // Chai-HTTP Assertions
  chai.use(assertions);
}
