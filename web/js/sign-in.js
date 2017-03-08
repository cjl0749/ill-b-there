(function() {
'use strict';

var SignInComponent = {};

SignInComponent.view = function () {
  return m('form[action="?"].panel.panel-sign-in', [
    m('h2', 'Sign In'),
    m('div.row', [
      m('label', 'Email'),
      m('input[type=text][autofocus].user-email')
    ]),
    m('div.row', [
      m('label', 'Password'),
      m('input[type=password].user-password')
    ]),
    m('div.row', [
      m('button[type=submit].sign-in-submit', 'Sign In'),
      m('button[type=button].sign-in-register', 'Register')
    ])
  ]);
};

window.SignInComponent = SignInComponent;
}());
