'use strict';

var m = require('mithril');
var App = require('../models/app');
var Users = require('../models/users');

// Object for storing application state shared across all routes
var app = new App();

var AppComponent = {};

AppComponent.oninit = function (vnode) {
  var state = {
    signOut: function (clickEvent) {
      clickEvent.preventDefault();
      Users.clearAuthentication();
      m.route.set('/sign-in');
    }
  };
  if (!Users.isAuthenticated() && m.route.get() !== '/sign-in') {
    m.route.set('/sign-in');
  }
  if (Users.isAuthenticated()) {
    Users.getCurrentUser({
      onsuccess: function (user) {
        app.user = user;
        m.redraw();
      }
    });
  }
  vnode.state = state;
};

AppComponent.view = function (vnode) {
  var state = vnode.state;
  return [
    m('header.app-header', [
      m('img.app-logo', {src: 'images/logo.svg', alt: 'Logo'}),
      m('h1.app-title', 'I\'ll B There'),
      Users.isAuthenticated() ? m('div.user-info', [
        app.user ?
          m('span.user-full-name', app.user.firstname + ' ' + app.user.lastname)
        : null,
        m('a[href=#]', {onclick: state.signOut}, 'Sign Out')
      ]) : null
    ]),
    // AppComponent acts as a layout which accepts any arbitrary sub-component
    // for content (this is to avoid duplication of static components, such as
    // the header and footer, across several components); see main.js
    m(vnode.attrs.ContentComponent, {app: app})
  ];
};


// Run callback when the Google Maps API is loaded and ready
window.mapsApiReady = function () {
  app.mapsApiReady = true;
  m.redraw();
};

module.exports = AppComponent;
