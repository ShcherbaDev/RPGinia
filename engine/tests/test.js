const assert = require('assert');

function asd(arg) {
    return arg === 1;
}

describe('Test', () => {
    it('Lorem ipsum', () => {
        assert.strictEqual(asd(1), true);
    })
});