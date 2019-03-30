const assert = require('assert');

function foo(bar) {
    return bar === 1;
}

describe('Test', () => {
    it('Lorem ipsum', () => {
        assert.strictEqual(foo(1), true);
    });
});

describe('Other test', () => {
    it('Lorem ipsum dolor sit amet', () => {
        assert.notStrictEqual(foo(2), true)
    });
});