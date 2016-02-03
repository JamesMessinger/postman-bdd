Postman BDD
============================
#### BDD test framework for Postman and Newman

[![Build Status](https://api.travis-ci.org/BigstickCarpet/postman-bdd.svg)](https://travis-ci.org/BigstickCarpet/postman-bdd)
[![Dependencies](https://david-dm.org/BigstickCarpet/postman-bdd.svg)](https://david-dm.org/BigstickCarpet/postman-bdd)
[![Coverage Status](https://coveralls.io/repos/BigstickCarpet/postman-bdd/badge.svg?branch=master&service=github)](https://coveralls.io/r/BigstickCarpet/postman-bdd)
[![Code Climate Score](https://codeclimate.com/github/BigstickCarpet/postman-bdd/badges/gpa.svg)](https://codeclimate.com/github/BigstickCarpet/postman-bdd)
[![Codacy Score](https://www.codacy.com/project/badge/XXXXXXXXXXXXXXXXXXXXXX)](https://www.codacy.com/public/jamesmessinger/postman-bdd)
[![Inline docs](http://inch-ci.org/github/BigstickCarpet/postman-bdd.svg?branch=master&style=shields)](http://inch-ci.org/github/BigstickCarpet/postman-bdd)

[![npm](http://img.shields.io/npm/v/postman-bdd.svg)](https://www.npmjs.com/package/postman-bdd)
[![Bower](http://img.shields.io/bower/v/postman-bdd.svg)](http://bower.io/)
[![License](https://img.shields.io/npm/l/postman-bdd.svg)](LICENSE)


This project is a port of [Chai HTTP](https://github.com/chaijs/chai-http) that runs in the [Postman REST Client](http://getpostman.com).  The API is exactly the same, but instead of using `chai.request("http://my-server.com")`, you can use the Postman GUI to build and send your HTTP request.


Example
--------------------------

```javascript
Coming Soon
```


Installation
--------------------------

```javascript
Coming Soon
```


API Documentation
--------------------------
The Postman BDD API is identical to [Chai HTTP's API](https://github.com/chaijs/chai-http#assertions), which is in-turn based on [SuperAgent's API](https://visionmedia.github.io/superagent/#response-properties).

#### `response` object
The [`response` object](https://visionmedia.github.io/superagent/#response-properties) is what you'll be doing most of your assertions on.  It contains all the information about your HTTP response.

##### `response.text`


Contributing
--------------------------
I welcome any contributions, enhancements, and bug-fixes.  [File an issue](https://github.com/BigstickCarpet/postman-bdd/issues) on GitHub and [submit a pull request](https://github.com/BigstickCarpet/postman-bdd/pulls).

#### Building/Testing
To build/test the project locally on your computer:

1. __Clone this repo__<br>
`git clone https://github.com/bigstickcarpet/postman-bdd.git`

2. __Install dependencies__<br>
`npm install`

3. __Run the tests__<br>
`npm test`

4. __Start the local web server__<br>
`npm start` (then browse to [http://localhost:8080/](http://bigstickcarpet.com/postman-bdd/index.html)


License
--------------------------
Postman BDD is 100% free and open-source, under the [MIT license](LICENSE). Use it however you want.
I
