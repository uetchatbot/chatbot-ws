'use strict';

const service = require('../app/services');

function interval() {
    setTimeout(function () {
        service.matchUser.randomMatchUser()
            .then((msg) => {
                interval();
            })
            .catch(err => {
                console.log(err);
                interval();
            })
    }, 1000);
}

module.exports = interval;