const lib = {};

lib.sum = function (values) {
    total = 0;

    for (let index = 0; index < values.length; index++ ) {
        if (typeof (values[index]) !== 'number') {
            return false;
        }
        total += values[index];
    };

    return total;
}

lib.checkEmail = function (str) {
    if (typeof (str) !== 'string') {
        return false;
    }
    if (str.length < 1) {
        return false;
    }

    var expression = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    return expression.test(str);
}

module.exports = lib;