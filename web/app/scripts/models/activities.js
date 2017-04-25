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

Activities.getNearbyActivities = function (args) {
  Api.get({
    path: '/api/activities',
    data: {
      latitude: args.latitude,
      longitude: args.longitude
    },
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
    data: {
      id: args.id
    },
    onsuccess: args.onsuccess,
    onerror: args.onerror
  });
};

// Return true if the given user is the creator of the given activity;
// otherwise, return false
Activities.isCreatorOf = function (user, activity) {
  return activity.creator_id === user.id;
};

// Return true if the given user is a participant of the given activity;
// otherwise, return false
Activities.isParticipantOf = function (user, activity) {
    return activity.participants.some(function (participant) {
      return participant.id === user.id;
    });
};


Activities.joinActivity = function (args) {
  Api.get({
    path: '/api/activities/:id/join',
    data: {
      id: args.activity.id
    },
    onsuccess: args.onsuccess,
    onerror: args.onerror
  });
};

Activities.leaveActivity = function (args) {
  Api.get({
    path: '/api/activities/:id/leave',
    data: {
      id: args.activity.id
    },
    onsuccess: args.onsuccess,
    onerror: args.onerror
  });
};

Activities.deleteActivity = function (args) {
  Api.delete({
    path: '/api/activities/:id',
    data: {
      id: args.activity.id
    },
    onsuccess: args.onsuccess,
    onerror: args.onerror
  });
};

Activities.prettifyDateTime = function (dateTimeStr, dateTimeFormat) {
  return moment(dateTimeStr, dateTimeFormat)
    .format('ddd, MMM Do, YYYY [at] h:MMa');
};

module.exports = Activities;
