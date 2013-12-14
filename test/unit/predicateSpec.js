'use strict';


describe('predicate', function(){

    beforeEach(function() {console.log('Before Test')});

  it('should throw exception when not passed a function in constructor', function () {
      expect(new Predicate('')).toThrow(Error)
  });
});
//