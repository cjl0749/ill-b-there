'use strict';

var Api = require('./api');
var Activities = {};

Activities.getCategories = function (args) {
  Api.get({
    path: '/api/activities/create',
    onsuccess: args.onsuccess,
    onerror: args.onerror
  });
};

module.exports = Activities;
