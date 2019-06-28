_app = {};

_app.tests = {};

_app.tests.unit = require('./unit');

_app.countTests = function () {
    let counter = 0;
    for (let key in _app.tests) {
        if (_app.tests.hasOwnProperty(key)) {
            const subTest = _app.tests[key];
            for (let testName in subTest) {
                if (subTest.hasOwnProperty(testName)) {
                    counter++;
                 }
            }
        }
    }

    return counter;
}

_app.produceTestReport = function (limit,successors,errors) {
    console.log('');
    console.log('---------------TEST REPORT-----------------');
    console.log('');
    console.log('Total Tests: ' + limit);
    console.log('\x1b[32m' + 'Passed: ' + '\x1b[0m' + successors);
    console.log('\x1b[31m' + 'Failed: ' + '\x1b[0m' + errors.length);
    console.log('')
    if (errors.length > 0) {
        console.log('------------------------------------------');
        console.log('-----------------ERRORS-------------------');
        console.log('------------------------------------------');
        errors.forEach(err => {
            console.log(err);
        });
        console.log('------------------------------------------');
        console.log('------------------------------------------');
    }

    console.log('');
    console.log('--------------------END--------------------');
}

_app.runTests = function () {
    let errors = [];
    let successes = 0;
    const limit = _app.countTests();
    let counter = 0;
    for (let key in _app.tests) {
        if (_app.tests.hasOwnProperty(key)) {
            const subTest = _app.tests[key];
            for (let testName in subTest) {
                if (subTest.hasOwnProperty(testName)) {
                    (function () {
                        const testValue = subTest[testName];
                        try {
                            testValue(function () {
                                console.log('\x1b[32m%s\x1b[0m', testName);
                                counter++;
                                successes++;
                                if (counter == limit) {
                                    _app.produceTestReport(limit, successes, errors);
                                }
                            });
                        } catch (error) {
                            errors.push({
                                name: testName,
                                error: error
                            });
                            console.log('\x1b[31m%s\x1b[0m', testName);
                            counter++;
                            if (counter == limit) {
                                _app.produceTestReport(limit, successes, errors);
                            }
                        }
                    })();
                }
            }
        }
    }
}

_app.runTests();