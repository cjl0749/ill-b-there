'use strict';

var m = require('mithril');
var Activities = require('../models/activities');
var LoadingComponent = require('./loading');
var CompletedComponent = require('./completed');

var CreatingActivityComponent = {};

CreatingActivityComponent.oninit = function (vnode) {
  var app = vnode.attrs.app;
  var state = {
    // A boolean indicating if the activity is in the process of being created
    creating: true,
    // A boolean indicating if there was an error creating the activity
    creationError: false,
    // Send the activity data to the server for creation
    createActivity: function () {
      Activities.createActivity({
        activity: app.activity,
        onsuccess: function () {
          state.creating = false;
          state.creationError = false;
          // We can reset the persisted activity data now that the activity has
          // been created
          app.activity = {};
          app.save();
          m.redraw();
          // Display success message for a moment before redirecting to activity
          // page
          // setTimeout(function () {
          //   m.route.set('/activity/:id');
          // }, 2000);
        },
        onerror: function () {
          state.creating = false;
          state.creationError = true;
          m.redraw();
        }
      });
    }
  };
  vnode.state = state;
  state.createActivity();
};

CreatingActivityComponent.view = function (vnode) {
  var state = vnode.state;
  return m('div.panel.panel-creating-activity', [
    state.creating ? [
      m('h2', 'Creating Activity...'),
      m(LoadingComponent)
    ] :
    state.creationError ? [
      m('h2', 'Creation Error'),
      m('p.error', 'There was an error creating the activity.')
    ] : [
      m('h2', 'Activity Created!'),
      m(CompletedComponent)
    ]
  ]);
};

module.exports = CreatingActivityComponent;
