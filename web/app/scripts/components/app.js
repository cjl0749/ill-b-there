'use strict';

var m = require('mithril');
var App = require('../models/app');
var Users = require('../models/users');
var ActivityProgressComponent = require('./activity-progress');

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
  if (!Users.isAuthenticated() && m.route.get() !== '/sign-in' && m.route.get() !== '/register') {
    // Redirect to the originally-requested page after signing in
    app.redirectRoute = m.route.get();
    m.route.set('/sign-in');
  }
  if (Users.isAuthenticated()) {
    Users.getCurrentUser({
      onsuccess: function (user) {
        app.user = user;
        app.triggerReady();
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
      m('div.app-header-content',
        Users.isAuthenticated() ? [
          app.user ?
            m('span.user-full-name',
              app.user.firstname + ' ' + app.user.lastname) : null
        ] : null,
        m('nav.app-navigation', m('ul', [
          Users.isAuthenticated() ? [
            m('li', m('a[href=#!/what]', 'Create Activity')),
            m('li', m('a[href=#!/profile]', 'Profile')),
            m('li', m('a[href=#]', {onclick: state.signOut}, 'Sign Out'))
          ] :
          m.route.get() === '/sign-in' ?
            m('li', m('a.register-link[href=#!/register]', 'Register')) :
          m.route.get() === '/register' ?
            m('li', m('a.register-link[href=#!/sign-in]', 'Sign In')) : null
        ]))
      )
    ]),
    // AppComponent acts as a layout which accepts any arbitrary sub-component
    // for content (this is to avoid duplication of static components, such as
    // the header and footer, across several components); see main.js
    m('div.page-content', m(vnode.attrs.ContentComponent, {
      app: app,
      key: vnode.attrs.key
    })),
    // A bar that shows where the user is in the activity creation process
    m(ActivityProgressComponent, {app: app})
  ];
};


// Run callback when the Google Maps API is loaded and ready
window.mapsApiReady = function () {
  app.mapsApiReady = true;
  m.redraw();
};

module.exports = AppComponent;
