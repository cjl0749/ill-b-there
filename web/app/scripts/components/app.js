'use strict';

var m = require('mithril');
var Api = require('../models/api');

// Object for storing application state shared across all routes
var app = {
  activity: {}
};

var AppComponent = {};

AppComponent.oninit = function (vnode) {
  var state = {
    signOut: function (clickEvent) {
      clickEvent.preventDefault();
      Api.clearAuthentication();
      m.route.set('/sign-in');
    }
  };
  if (!Api.isAuthenticated() && m.route.get() !== 'sign-in') {
    m.route.set('/sign-in');
  }
  vnode.state = state;
};

AppComponent.view = function (vnode) {
  var state = vnode.state;
  return [
    m('header.app-header', [
      m('img.app-logo', {src: 'images/logo.svg', alt: 'Logo'}),
      m('h1.app-title', 'I\'ll B There'),
      Api.isAuthenticated() ? m('div.user-info', [
        m('span.user-email', Api.userEmail),
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
