'use strict';

var m = require('mithril');
var AppComponent = require('./components/app');
var SignInComponent = require('./components/sign-in');
var WhatComponent = require('./components/what');
var WhereComponent = require('./components/where');
var ProfileComponent = require('./components/profile');


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
  },
  '/profile': {
    render: function () {
      return m(AppComponent, {ContentComponent: ProfileComponent});
    }
  }
});
