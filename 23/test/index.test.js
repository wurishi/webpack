const assert = require('assert');
const { fn } = require('../src/index');

describe('index.js', () => {
  describe('fn', () => {
    it('generator fn', () => {
      const iter = fn();
      assert.strictEqual(iter.next().value, 'Hello');
      assert.strictEqual(iter.next().value, 'World');
    });
  });
});
