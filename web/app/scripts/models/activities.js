'use strict';

var Api = require('./api');
var moment = require('moment');

// The Activities model inherits all properties and methods from Api
var Activities = Object.create(Api);

Activities.getCategories = function (args) {
  Api.get({
    path: '/api/activities/create',
    onsuccess: args.onsuccess,
    onerror: args.onerror
  });
};

Activities.createActivity = function (args) {
  Api.post({
    path: '/api/activities',
    data: args.activity,
    onsuccess: args.onsuccess,
    onerror: args.onerror
  });
};

Activities.getActivity = function (args) {
  Api.get({
    path: '/api/activities/:id',
    data: args.data,
    onsuccess: args.onsuccess,
    onerror: args.onerror
  });
};

Activities.prettifyDateTime = function (datetimeStr, datetimeFormat) {
  return moment(datetimeStr, datetimeFormat)
    .format('ddd, MMM Do, YYYY [at] h:MMa');
};

module.exports = Activities;
