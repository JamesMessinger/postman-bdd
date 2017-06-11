# Change Log
All notable changes will be documented in this file.
`postman-bdd` adheres to [Semantic Versioning](http://semver.org/).


## [v5.0.0](https://github.com/BigstickCarpet/postman-bdd/tree/v5.0.0) (2017-06-11)

#### Breaking Changes:
Upgraded to Chai.js 4.0, which includes [some breaking changes](https://github.com/chaijs/chai/releases/tag/4.0.0). If these changes affect you, then you can continue using Postman BDD v4 by downloading it from the following URL (notice the `v4` in the path):
<br>
<br>
[`http://bigstickcarpet.com/postman-bdd/dist/v4/postman-bdd.min.js`](http://bigstickcarpet.com/postman-bdd/dist/v4/postman-bdd.min.js)

[Full Changelog](https://github.com/BigstickCarpet/postman-bdd/compare/v4.3.0...v5.0.0)


## [v4.3.0](https://github.com/BigstickCarpet/postman-bdd/tree/v4.3.0) (2017-04-08)

- Added TypeScript definitions (thanks to [urosjarc](https://github.com/urosjarc) for the [pull request](https://github.com/BigstickCarpet/postman-bdd/pull/7))

[Full Changelog](https://github.com/BigstickCarpet/postman-bdd/compare/v4.2.0...v4.3.0)


## [v4.2.1](https://github.com/BigstickCarpet/postman-bdd/tree/v4.2.1) (2017-03-07)

- Ensure that all header names in the `response.headers` object are lowercased. This should have always been the case, since it's consistent with the SuperAgent API

- Minor tweak to the way `before` and `after` hooks are labeled.  Previously, the label included the name of the `describe` block that the hook ran before/after

- Refactored [the `response` object](https://github.com/BigstickCarpet/postman-bdd/blob/f52dfe47c16a4e2619223a606afc7e7c54d48ffe/lib/response.js) to expose simple fields rather than property getters.  This simplifies the code, and performs slightly better.

[Full Changelog](https://github.com/BigstickCarpet/postman-bdd/compare/v4.0.0...v4.2.1)


## [v4.0.0](https://github.com/BigstickCarpet/postman-bdd/tree/v4.0.0) (2017-03-06)

#### Breaking Changes:
- Test names are now prefixed with a number to ensure uniqueness.  Previously, if you have two tests with the same name, the first one wouldn't be recorded, since Postman uses a dictionary to store test results

#### Other Changes:
- Added a [sample Postman collection](https://documenter.getpostman.com/view/220187/postman-bdd-examples/6Z3uY71) with several requests that demonstrate basic and advanced usage of Postman BDD

- Added a `response.should.be.xml` assertion, which is a shorthand for asserting that the `Content-Type` header is set to `application/xml`

[Full Changelog](https://github.com/BigstickCarpet/postman-bdd/compare/v3.0.0...v4.0.0)


## [v3.0.0](https://github.com/BigstickCarpet/postman-bdd/tree/v3.0.0) (2017-03-05)

#### Breaking Changes:
- If the response is JSON or XML, then it is [automatically parsed for you](https://github.com/BigstickCarpet/postman-bdd/blob/d32f3996723502f7c01c17b324808000e67f7ba4/lib/response.js#L317-L351).  No need to call `JSON.parse()` or `xml2json()` first.

- If automatic body parsing fails (e.g invalid JSON or XML), then **no** error is thrown. Instead, `response.body` will just be the plain-text response

#### Other Changes:
- Fixed [issue #5](https://github.com/BigstickCarpet/postman-bdd/issues/5), where a failed assertion would appear as multiple failed tests in Postman

[Full Changelog](https://github.com/BigstickCarpet/postman-bdd/compare/v2.1.0...v3.0.0)
