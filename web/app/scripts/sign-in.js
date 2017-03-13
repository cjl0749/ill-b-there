'use strict';

var m = require('mithril');
var LoadingComponent = require('./loading');

var SignInComponent = {};

SignInComponent.oninit = function (vnode) {
  vnode.state = {
    signIn: function (submitEvent) {
      // Simulate the user signing in
      vnode.attrs.app.authenticating = true;
      setTimeout(function () {
        vnode.attrs.app.authenticating = false;
        window.location.href = '#!/where';
      }, 500);
      // Since authentication will be performed asynchronously within
      // JavaScript, ensure that the browser does not submit the form
      // synchronously
      submitEvent.preventDefault();
    }
  };
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
          m('input[type=text][required][autofocus].user-email')
        ]),
        m('div.row', [
          m('label', 'Password'),
          m('input[type=password][required].user-password')
        ]),
        m('div.row', [
          m('button[type=submit].sign-in-submit', 'Sign In'),
          m('button[type=button].sign-in-register', 'Register')
        ])
      ])
  ]);
};

module.exports = SignInComponent;
