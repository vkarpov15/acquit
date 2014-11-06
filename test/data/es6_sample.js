describe('ES6', function() {
  // ES6 has a `yield` keyword
  it('should be able to yield', function() {
    co(function*() {
      yield 1;
    })();
  });
});
