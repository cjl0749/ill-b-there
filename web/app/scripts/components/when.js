'use strict';

var m = require('mithril');
var moment = require('moment');
var Flatpickr = require('flatpickr');
var NextControlComponent = require('./next-control');

var WhenComponent = {};

WhenComponent.oninit = function (vnode) {
  var app = vnode.attrs.app;
  var state = {
    // The default number of minutes to increment by when changing the time
    // (default is 5 minutes)
    minuteIncrement: 5,
    // The number of milliseconds in one minute of time
    MIN_TO_MS: 60000,
    // Round up the minutes in the given date/time to the next multiple of 5
    // (e.g. if the time is 5:31pm, the rounded time will be 5:35pm, but if the
    // time is 5:35pm, it will stay as such)
    roundUpMinutes: function (timestamp) {
      // timestamp is a number of milliseconds since January 1st, 1970
      var minuteIncrementMs = state.minuteIncrement * state.MIN_TO_MS;
      return Math.ceil(timestamp / minuteIncrementMs) * minuteIncrementMs;
    },
    // Get the initial date/time value for the picker
    getInitialDateTime: function (dateTime) {
      if (app.activity.event_at) {
        // Use last-saved date/time if saved
        return moment(app.activity.event_at, app.dateTimeFormat);
      } else {
        // Otherwise, use next 5-minute increment from the current date/time
        return moment(state.roundUpMinutes(moment({
          years: dateTime.year(),
          months: dateTime.month(),
          date: dateTime.date(),
          hours: dateTime.hour(),
          minutes: dateTime.minute()
        }).valueOf()));
      }
    },
    getFormattedDateTime: function () {
      var dateTime = moment(state.picker.input.value);
      return dateTime.format(app.dateTimeFormat);
    },
    // Saves the selected date/time to the app data
    saveDateTime: function () {
      app.activity.event_at = state.getFormattedDateTime(state.picker.input.value);
      app.save();
    },
    initializeDateTimePicker: function (pickerVnode) {
      // new Date() with no arguments defaults to the current date/time
      var now = moment();
      state.picker = new Flatpickr(pickerVnode.dom, {
        defaultDate: state.getInitialDateTime(now).toDate(),
        // Allow user to select time in addition to date
        enableTime: true,
        // Hide original input, displaying a more-intuitive control instead
        altInput: true,
        minuteIncrement: state.minuteIncrement
      });
      pickerVnode.dom.addEventListener('change', state.saveDateTime);
    },
    goToNextScreen: function () {
      state.saveDateTime();
      m.route.set('/confirm-activity');
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
        onclick: state.goToNextScreen
      })
    ])
  ]);
};

module.exports = WhenComponent;
