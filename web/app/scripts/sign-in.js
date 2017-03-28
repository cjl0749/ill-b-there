'use strict';

var m = require('mithril');
var Api = require('./api');
var Users = require('./users');
var LoadingComponent = require('./loading');

var SignInComponent = {};

SignInComponent.oninit = function (vnode) {
  var state = {
    redirectToWhere: function () {
      m.route.set('/where');
    },
    signIn: function (submitEvent) {
      // Since authentication will be performed asynchronously within
      // JavaScript, ensure that the browser does not submit the form
      // synchronously
      submitEvent.preventDefault();
      // Simulate the user signing in
      vnode.attrs.app.authenticating = true;
      Users.signIn({
        email: submitEvent.target.elements.email.value,
        password: submitEvent.target.elements.password.value,
        success: vnode.state.redirectToWhere
      });
    }
  };
  if (Api.isAuthenticated()) {
    state.redirectToWhere();
  }
  vnode.state = state;
};

SignInComponent.view = function (vnode) {
  var state = vnode.state;
  return m('div.panel.panel-sign-in', [
    m('h2', vnode.attrs.app.authenticating ? 'Signing In...' : 'Sign In'),
    vnode.attrs.app.authenticating ?
      m(LoadingComponent) :
      m('form', {method: 'POST', onsubmit: state.signIn}, [
        m('div.row', [
          m('label', 'Email'),
          m('input[type=email][name=email][required][autofocus].user-email')
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
