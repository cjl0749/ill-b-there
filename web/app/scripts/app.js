'use strict';

var m = require('mithril');
var Api = require('./api');

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
      m('nav.app-nav', m('ul', [
          Api.isAuthenticated() ?
          m('li', m('a[href=#]', {onclick: state.signOut}, 'Sign Out')) : null
      ]))
    ]),
    // AppComponent acts as a layout which accepts any arbitrary sub-component
    // for content (this is to avoid duplication of static components, such as
    // the header and footer, across several components); see main.js
    m(vnode.attrs.ContentComponent, {app: vnode.attrs.app})
  ];
};

module.exports = AppComponent;
