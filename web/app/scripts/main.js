'use strict';

var m = require('mithril');
var AppComponent = require('./app');
var SignInComponent = require('./sign-in');
var WhatComponent = require('./what');
var WhereComponent = require('./where');

// Object for storing application state shared across all routes
var app = {
  activity: {}
};

m.route(document.querySelector('main'), '/sign-in', {
  '/sign-in': {
    render: function () {
      return m(AppComponent, {app: app, ContentComponent: SignInComponent});
    }
  },
  '/what': {
    render: function () {
      return m(AppComponent, {app: app, ContentComponent: WhatComponent});
    }
  },
  '/where': {
    render: function () {
      return m(AppComponent, {app: app, ContentComponent: WhereComponent});
    }
  }
});

// Run callback when the Google Maps API is loaded and ready
window.mapsApiReady = function () {
  app.mapsApiReady = true;
  m.redraw();
};
