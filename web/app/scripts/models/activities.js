'use strict';

var Api = require('./api');

// The Activities model inherits all properties and methods from Api
var Activities = Object.create(Api);

Activities.getCategories = function (args) {
  Api.get({
    path: '/api/activities/create',
    onsuccess: args.onsuccess,
    onerror: args.onerror
  });
};

module.exports = Activities;
