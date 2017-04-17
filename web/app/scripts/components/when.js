'use strict';

var m = require('mithril');
var Flatpickr = require('flatpickr');
var NextControlComponent = require('./next-control');

var WhenComponent = {};

WhenComponent.oninit = function (vnode) {
  var app = vnode.attrs.app;
  var state = {
    // The default number of minutes to increment by when changing the time
    // (default is 5 minutes)
    minuteIncrement: 5,
    // Get the next minute value (relative to the current minute) that has a
    // minute value divisible by 5 (e.g. if the time is 5:31pm, the rounded time
    // will be 5:35pm, but if the time is 5:35pm, it will stay as such)
    roundUpMinutes: function (numMinutes) {
      return Math.ceil(numMinutes / state.minuteIncrement) * state.minuteIncrement;
    },
    // Get the initial date/time value for the picker
    getInitialDateTime: function (datetime) {
      if (app.activity.event_at) {
        // Use last-saved date/time if saved
        return new Date(app.activity.event_at);
      } else {
        // Otherwise, use next 5-minute increment from the current date/time
        return new Date(
          datetime.getFullYear(),
          datetime.getMonth(),
          datetime.getDate(),
          datetime.getHours(),
          state.roundUpMinutes(datetime.getMinutes())
        );
      }
    },
    // Saves the selected date/time to the app data
    saveDateTime: function () {
      app.activity.event_at = new Date(state.picker.input.value).toString();
      app.save();
    },
    initializeDateTimePicker: function (pickerVnode) {
      // new Date() with no arguments defaults to the current date/time
      var now = new Date();
      state.picker = new Flatpickr(pickerVnode.dom, {
        defaultDate: state.getInitialDateTime(now),
        // Allow user to select time in addition to date
        enableTime: true,
        // Hide original input, displaying a more-intuitive control instead
        altInput: true
      });
      pickerVnode.dom.addEventListener('change', state.saveDateTime);
    },
    goToNextScreen: function () {
      state.saveDateTime();
      // m.route.set('/activity');
    }
  };
  vnode.state = state;
};

WhenComponent.view = function (vnode) {
  var state = vnode.state;
  return m('div.panel.panel-when', [
    m('h2', 'Select a time'),
    m('p', 'Click the input field to set a date/time'),
    m('div.when-controls', [
      m('input[type=text].when-datetime-picker', {
        placeholder: 'Click to select time...',
        oncreate: state.initializeDateTimePicker
      }),
      m(NextControlComponent, {
        onclick: state.setDateTime
      })
    ])
  ]);
};

module.exports = WhenComponent;
