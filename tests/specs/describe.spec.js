var result;


result = describe();  // Describe called with no args
result.should.deep.equal({
  'describe #1': false,
  'this.fn is not a function': false
});


result = describe('Describe called without a function');
result.should.deep.equal({
  'Describe called without a function': false,
  'this.fn is not a function': false
});


result = describe(function() {}); // Describe called with no name
result.should.be.empty;


result = describe('Describe called with no tests', function() {});
result.should.be.empty;


result = describe('Error in describe block', function() {
  throw new Error('BOOM!');
});
result.should.deep.equal({
  'Error in describe block': false,
  'BOOM!': false
});
