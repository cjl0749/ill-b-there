'use strict';

var m = require('mithril');
var Api = require('./api');
var Users = require('./users');
var LoadingComponent = require('./loading');

var SignInComponent = {};

SignInComponent.oninit = function (vnode) {
  var state = {
    redirectToNextScreen: function () {
      m.route.set('/what');
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
        onsuccess: state.redirectToNextScreen,
        onerror: function () {
          state.authenticating = false;
          state.invalid = true;
          m.redraw();
        }
      });
    }
  };
  if (Api.isAuthenticated()) {
    state.redirectToNextScreen();
  }
  vnode.state = state;
};

SignInComponent.view = function (vnode) {
  var state = vnode.state;
  return m('div.panel.panel-sign-in', [
    state.invalid ? m('div.row', [
      m('p.error.sign-in-error', 'Incorrect email or password')
    ]) : null,
    m('h2', state.authenticating ? 'Signing In...' : 'Sign In'),
    state.authenticating ?
      m(LoadingComponent) :
      m('form', {method: 'POST', onsubmit: state.signIn}, [
        m('div.row', [
          m('label', 'Email'),
          m('input[type=email][name=email][required].user-email', {
            oncreate: function (inputVnode) {
              inputVnode.dom.focus();
            }
          })
        ]),
        m('div.row', [
          m('label', 'Password'),
          m('input[type=password][name=password][required].user-password')
        ]),
        m('div.row', [
          m('button[type=submit].sign-in-submit', 'Sign In'),
          m('button[type=button].sign-in-register', 'Register')
        ])
      ])
  ]);
};

module.exports = SignInComponent;
