// Type definitions for Postman bdd testing framework.
// Project: https://github.com/BigstickCarpet/postman-bdd
// Definitions by: Uroš Jarc <https://github.com/urosjarc/>,
//                 James Messinger <https://github.com/BigstickCarpet/>
// Definitions: https://github.com/BigstickCarpet/postman-bdd/tree/master/types


/**
 * DEPENDENCIES
 */

declare class Should {
  //Chains
  to: Should;
  be: Should;
  been: Should;
  is: Should;
  that: Should;
  which: Should;
  and: Should;
  has: Should;
  have: Should;
  with: Should;
  at: Should;
  of: Should;
  same: Should;

  //Assserting
  not: Should;
  deep: Should;
  any: Should;
  //TODO: Add more methods for should. http://chaijs.com/api/assert/
}

/**
 * CORE
 */
declare const postmanBDD: {
  logLevel: string;
};

/**
 * MOCHA
 * TODO: Are they really return void?
 */
declare function describe(cb: Function): void;
declare function describe(msg: string, cb: Function): void;

declare function it(cb: Function): void;
declare function it(msg: string, cb: Function): void;

declare function before(cb: Function): void;
declare function before(msg: string, cb: Function): void;

declare function after(cb: Function): void;
declare function after(msg: string, cb: Function): void;

declare function beforeEach(cb: Function): void;
declare function beforeEach(msg: string, cb: Function): void;

declare function afterEach(cb: Function): void;
declare function afterEach(msg: string, cb: Function): void;


/**
 * CHAI
 * TODO: What are those 2 function return?
 * TODO: I could not find assert example in tests.
 * TODO: Connect those with CHAI.Should.
 */
declare function expect(expression: boolean, msg?: string): Should;
declare function assert(expression: boolean, msg?: string): void;

declare namespace assert {
    export function isOk(expression: boolean, msg: string) : void|Error;
    export function isNotOk(expression: boolean, msg: string) : void|Error;
    export function equal(expression: boolean, msg: string) : void|Error;
    export function notEqual(expression: boolean, msg: string) : void|Error;
    export function strictEqual(expression: boolean, msg: string) : void|Error;
    export function notStrictEqual(expression: boolean, msg: string) : void|Error;
    export function deepEqual(expression: boolean, msg: string) : void|Error;
    export function notDeepEqual(expression: boolean, msg: string) : void|Error;
    //TODO: Add more methods for assert. http://chaijs.com/api/bdd/
}

declare namespace chai {
  export function should(expression: boolean): Should; //TODO: Is this right?

  export function use(cb: Function): void;

  export function assert(expression?: any): void|Error;

  export function expect(expression: boolean, msg?: string): Should;
}

/**
 * REQ
 * TODO: What to do? Sandbox has the same object...https://github.com/DefinitelyTyped/DefinitelyTyped/pull/15691/commits/88f1a55a5ae47ea6637c03e45b3a9734d14b3580#diff-3ad1ab97698a364567e6e50bcf560a1bR27
 */
declare const request: {
  method: string|Should;
  url: string|Should;
  headers: Object|Should;
  data: Object|Should;
};

/**
 * RES
 */
declare const response: {
  status: number|Should;
  statusType: number|Should;
  info: boolean|Should;
  ok: boolean|Should;
  redirect: boolean|Should;
  clientError: boolean|Should;
  serverError: boolean|Should;
  error: boolean|Should;
  accepted: boolean|Should;
  noContent: boolean|Should;
  badRequest: boolean|Should;
  unauthorized: boolean|Should;
  notAcceptable: boolean|Should;
  notFound: boolean|Should;
  forbidden: boolean|Should;
  time: number|Should;
  headers: Object|Should;
  type: string|Should;
  charset: string|Should;
  cookies: Object|Should;
  text: string|Should;
  body: Object|Should;
  getHeader(name: string) : string|Should;
  getCookie(name: string) : any|Should; //TODO: Any or string?
};
