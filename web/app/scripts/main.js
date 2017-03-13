'use strict';

var m = require('mithril');
var AppComponent = require('./app');
var SignInComponent = require('./sign-in');
var WhereComponent = require('./where');

// Object for storing application state shared across all routes
var app = {};

m.route(document.querySelector('main'), '/sign-in', {
  '/sign-in': {
    render: function () {
      return m(AppComponent, {app: app, ContentComponent: SignInComponent});
    }
  },
  '/where': {
    render: function () {
      return m(AppComponent, {app: app, ContentComponent: WhereComponent});
    }
  }
});

// Run callback when the Google Maps API initialized
window.initializeMap = function () {
  app.initializedMap = true;
  m.redraw();
};
