'use strict';

var m = require('mithril');

  // A bar that shows where the user is in the activity creation process
var ActivityProgressComponent = {};

ActivityProgressComponent.oninit = function (vnode) {
  var state = {
    steps: [
      {
        // The label to show in the UI
        label: 'What',
        // The route the label should link to
        route: '/what',
        // The name of the corresponding activity model field (this indicates
        // whether this step can be marked as completed)
        field: 'category_id'
      },
      {
        label: 'Where',
        route: '/where',
        field: 'address'
      },
      {
        label: 'When',
        route: '/when',
        field: 'event_at'
      },
      {
        label: 'Confirm',
        route: '/confirm-activity',
        field: 'created'
      }
    ],
    // Return true if the user is currently on an activity creation page;
    // otherwise, return false
    inProgress: function () {
      var currentRoute = m.route.get();
      return state.steps.some(function (step) {
        return step.route === currentRoute;
      });
    }
  };
  vnode.state = state;
};

ActivityProgressComponent.view = function (vnode) {
  var state = vnode.state;
  var app = vnode.attrs.app;
  // This outer container is empty snd unstyled because the inner contents are
  // shown conditionally
  return m('div.activity-progress-container', state.inProgress() ? [
    m('div.activity-progress-bar', [
      m('div.activity-progress-steps', state.steps.map(function (step, s) {
        return m('a.activity-progress-step', {
          href: '#!' + step.route,
          class: app.activity[step.field] ? 'completed' : 'incomplete'
        }, [
          m('div.activity-progress-step-number', {
          }, s + 1),
          m('span.activity-progress-label', step.label)
        ]);
      }))
    ])
  ] : null);
};

module.exports = ActivityProgressComponent;
