'use strict';

var m = require('mithril');
var AppComponent = require('./app');
var SignInComponent = require('./sign-in');
var WhatComponent = require('./what');
var WhereComponent = require('./where');

m.route(document.querySelector('main'), '/sign-in', {
  '/sign-in': {
    render: function () {
      return m(AppComponent, {ContentComponent: SignInComponent});
    }
  },
  '/what': {
    render: function () {
      return m(AppComponent, {ContentComponent: WhatComponent});
    }
  },
  '/where': {
    render: function () {
      return m(AppComponent, {ContentComponent: WhereComponent});
    }
  }
});
