
const lib = require('../app/lib');
const assert = require('assert');

let unit = {};

// Assert sum should return a number
unit['lib.sum should return a number'] = function (done) {
    const val = lib.sum([-1, -2, 3, 4]);
    assert.equal(typeof (val), 'number');
    done();
}

// Assert sum should return 11
unit['lib.sum should return 5'] = function (done) {
    const val = lib.sum([2,-3]);
    assert.equal(val, -1);
    done();
}

// Assert sum should return false if input is not a number
unit['lib.sum should return false'] = function (done) {
    const val = lib.sum([1, 'potato', {'navel': 'shavel'}, 4, 5]);
    assert.equal(val, false);
    done();
}

// Assert checkEmail should return true for correct email
unit['lib.checkEmail should return true'] = function (done) {
    const val = lib.checkEmail('shaurya@abc.com');
    assert.equal(val, true);
    done();
}

// Assert checkEmail should return false for invalid email
unit['lib.checkEmail should return false'] = function (done) {
    const val = lib.checkEmail('shau213@..com');
    assert.equal(val, false);
    done();
}


module.exports = unit;