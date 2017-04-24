'use strict';

var m = require('mithril');
var Users = require('../models/users');
var LoadingComponent = require('./loading');

var SignInComponent = {};

SignInComponent.oninit = function (vnode) {
  var app = vnode.attrs.app;
  var state = {
    redirectToNextScreen: function () {
      // If the visitor attempted to access a page that required authentication,
      // redirect to that page after they sign in
      if (app.redirectRoute) {
        m.route.set(app.redirectRoute);
        delete app.redirectRoute;
      } else {
        m.route.set('/what');
      }
    },
    signIn: function (submitEvent) {
      // Since authentication will be performed asynchronously within
      // JavaScript, ensure that the browser does not submit the form
      // synchronously
      submitEvent.preventDefault();
      state.invalid = false;
      state.authenticating = true;
      Users.signIn({
        email: submitEvent.target.elements.email.value,
        password: submitEvent.target.elements.password.value,
        onsuccess: function (user) {
            app.user = user;
            app.triggerReady();
            state.redirectToNextScreen();
        },
        onerror: function () {
          state.authenticating = false;
          state.invalid = true;
          m.redraw();
        }
      });
    }
  };
  if (Users.isAuthenticated()) {
    state.redirectToNextScreen();
  }
  vnode.state = state;
};

SignInComponent.view = function (vnode) {
  var state = vnode.state;
  var app = vnode.attrs.app;
  return m('div.panel.panel-sign-in', [
    state.invalid ? m('div.row', [
      m('p.error.sign-in-error', 'Incorrect email or password')
    ]) : null,
    app.redirectRoute && !state.authenticating && !state.invalid ?
      m('div.row', m('p.error', 'Please sign in to view this page:')) : null,
    m('h2', state.authenticating ? 'Signing In...' : 'Sign In'),
    state.authenticating ?
      m(LoadingComponent) :
      m('form', {method: 'POST', onsubmit: state.signIn}, [
        m('div.row', [
          m('label[for=user-email]', 'Email'),
          m('input[type=email][name=email][required]#user-email', {
            oncreate: function (inputVnode) {
              inputVnode.dom.focus();
            }
          })
        ]),
        m('div.row', [
          m('label[for=user-password]', 'Password'),
          m('input[type=password][name=password][required]#user-password')
        ]),
        m('div.row', [
          m('button[type=submit].sign-in-submit', 'Sign In')
        ])
      ])
  ]);
};

module.exports = SignInComponent;
