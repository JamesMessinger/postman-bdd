/**
 * MOCHA
 * TODO: Are they really return void?
 */
declare function describe(msg?: string, cb: Function): void;
declare function it(msg?: string, cb: Function): void;
declare function before(msg?: string, cb: Function): void;
declare function after(msg?: string, cb: Function): void;
declare function beforeEach(msg?: string, cb: Function): void;
declare function afterEach(msg?: string, cb: Function): void;

/**
 * CHAI
 * TODO: What are those 2 function return?
 * TODO: I could not find assert example in tests.
 */
declare function assert(expression: boolean, msg?: string): any | Error;
declare function expect(expression?: any): any | Error;

/**
 * CORE
 */
declare const postmanBDD: {
  logLevel: string;
};

/**
 * REQ
 * TODO: What to do? Sandbox has the same object...https://github.com/DefinitelyTyped/DefinitelyTyped/pull/15691/commits/88f1a55a5ae47ea6637c03e45b3a9734d14b3580#diff-3ad1ab97698a364567e6e50bcf560a1bR27
 */
declare const request: {
  method: string;
  url: string;
  headers: Object;
  data: Object;
};

/**
 * RES
 */
declare const response: {
  status: number;
  statusType: number;
  info: boolean;
  ok: boolean;
  redirect: boolean;
  clientError: boolean;
  serverError: boolean;
  error: boolean;
  accepted: boolean;
  noContent: boolean;
  badRequest: boolean;
  unauthorized: boolean;
  notAcceptable: boolean;
  notFound: boolean;
  forbidden: boolean;
  time: number;
  headers: Object;
  type: string;
  charset: string;
  cookies: Object;
  text: string;
  body: Object;
  getHeader: (name: string) => string;
  getCookie: (name: string) => any; //TODO: Any or string?
};


chai
  .use(function)
  .assert(boolean, [string])
  .expect([any])
  .should

  [anything].should
  .to
  .be
  .been
  .is
  .that
  .which
  .and
  .has
  .have
  .with
  .at
  .of
  .same
  .a
  .an
  .equal
  .deep
....
(all
the
rest
of
the
Chai
and
Chai - Http
assertions
)
