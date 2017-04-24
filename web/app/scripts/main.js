'use strict';

var m = require('mithril');
var AppComponent = require('./components/app');
var RegisterComponent = require('./components/register');
var SignInComponent = require('./components/sign-in');
var WhatComponent = require('./components/what');
var WhereComponent = require('./components/where');
<<<<<<< HEAD
var ProfileComponent = require('./components/profile');

=======
var WhenComponent = require('./components/when');
var ConfirmActivityComponent = require('./components/confirm-activity');
var ActivityComponent = require('./components/activity');
>>>>>>> master

m.route(document.querySelector('main'), '/sign-in', {
  '/register': {
    render: function () {
      return m(AppComponent, {ContentComponent: RegisterComponent});
    }
  },
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
<<<<<<< HEAD
  '/profile': {
    render: function () {
      return m(AppComponent, {ContentComponent: ProfileComponent});
=======
  '/when': {
    render: function () {
      return m(AppComponent, {ContentComponent: WhenComponent});
    }
  },
  '/confirm-activity': {
    render: function () {
      return m(AppComponent, {ContentComponent: ConfirmActivityComponent});
    }
  },
  '/activity/:key': {
    render: function () {
      return m(AppComponent, {
        key: m.route.param('key'),
        ContentComponent: ActivityComponent
      });
>>>>>>> master
    }
  }
});
