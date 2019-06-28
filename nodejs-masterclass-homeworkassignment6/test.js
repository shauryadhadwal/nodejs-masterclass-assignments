const http = require('http');

function init() {
    try {
        count = 0;
        while (count++ < 10) {
            http.get('http://localhost:3000/hello');
        }
    } catch (err) {
        console.error(err);
    }
}

init();