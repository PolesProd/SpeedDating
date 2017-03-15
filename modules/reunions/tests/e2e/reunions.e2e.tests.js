'use strict';

describe('Reunions E2E Tests:', function () {
  describe('Test Reunions page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/reunions');
      expect(element.all(by.repeater('reunion in reunions')).count()).toEqual(0);
    });
  });
});
