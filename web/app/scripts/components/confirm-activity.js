'use strict';

var m = require('mithril');
var Activities = require('../models/activities');
var LoadingComponent = require('./loading');
var CompletedComponent = require('./completed');

var ConfirmActivityComponent = {};

ConfirmActivityComponent.oninit = function (vnode) {
  var app = vnode.attrs.app;
  var state = {
    // A boolean indicating if the activity is in the process of being created
    creating: false,
    // A boolean indicating if the activity has been successfully created
    created: false,
    // A boolean indicating if there was an error creating the activity
    creationError: false,
    // Send the activity data to the server for creation
    createActivity: function () {
      state.creating = true;
      state.created = false;
      state.creationError = false;
      Activities.createActivity({
        activity: app.activity,
        onsuccess: function (activity) {
          state.creating = false;
          state.creationError = false;
          state.created = true;
          // We can reset the persisted activity data now that the activity has
          // been created
          app.activity = {};
          app.save();
          m.redraw();
          // Display success message for a moment before redirecting to activity
          // page
          setTimeout(function () {
            m.route.set('/activity/:key', {key: activity.id});
          }, 2000);
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
};

ConfirmActivityComponent.view = function (vnode) {
  var state = vnode.state;
  var app = vnode.attrs.app;
  return m('div.panel.panel-confirm-activity', [
    state.creating ? [
      m('h2', 'Creating Activity...'),
      m(LoadingComponent)
    ] :
    state.created ? [
      m('h2', 'Activity Created!'),
      m(CompletedComponent)
    ] : [
      state.creationError ?
        m('p.error', 'There was an error creating the activity.') : null,
      m('h2', 'Confirm Activity'),
      m('div.confirm-activity-fields', [
        app.activity.category_name ? [
          m('label', 'What'),
          m('div.activity-field-value', app.activity.category_name)
        ] : null,
        app.activity.description ? [
          m('label.activity-field-name', 'Description'),
          m('div.activity-field-value', app.activity.description)
        ] : null,
        app.activity.address ? [
          m('label.activity-field-name', 'Where'),
          m('div.activity-field-value', app.activity.address)
        ] : null,
        app.activity.event_at ? [
          m('label.activity-field-name', 'When'),
          m('div.activity-field-value', Activities.prettifyDateTime(app.activity.event_at, app.dateTimeFormat))
        ] : null
      ]),
      (app.activity.category_name && app.activity.address && app.activity.event_at) ?
        m('button[type=submit]', {
          onclick: state.createActivity
        }, 'Create Activity') :
      m('p.error', 'Activity missing some fields.')
    ]
  ]);
};

module.exports = ConfirmActivityComponent;
