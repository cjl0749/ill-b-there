'use strict';

var m = require('mithril');
var Users = require('../models/users');
var LoadingComponent = require('./loading');

var RegisterComponent = {};

RegisterComponent.oninit = function (vnode) {
  var state = {
    register: function (submitEvent) {
      // Since authentication will be performed asynchronously within
      // JavaScript, ensure that the browser does not submit the form
      // synchronously
      submitEvent.preventDefault();
      state.registering = true;
      Users.register({
        onsuccess: function () {
          state.registering = false;
          state.errorRegistering = false;
        },
        onerror: function () {
          state.registering = false;
          state.errorRegistering = true;
        }
      });
    }
  };
  vnode.state = state;
};

RegisterComponent.view = function (vnode) {
  var state = vnode.state;
  return m('div.panel.panel-register', [
    m('h2', 'Register'),
    state.invalid ? m('div.row', [
      m('p.error.register-error', 'Error registering new user')
    ]) : null,
    state.registering ?
      m(LoadingComponent) :
      m('form', {method: 'POST', onsubmit: state.register}, [
        m('div.row', [
          m('label[for=user-first-name]', 'First Name'),
          m('input[type=text][name=firstname][required]#user-first-name', {
            oncreate: function (inputVnode) {
              inputVnode.dom.focus();
            }
          })
        ]),
        m('div.row', [
          m('label[for=user-last-name]', 'Last Name'),
          m('input[type=text][name=lastname][required]#user-last-name')
        ]),
        m('div.row', [
          m('label[for=user-email]', 'Email'),
          m('input[type=email][name=email][required]#user-email')
        ]),
        m('div.row', [
          m('label[for=user-password]', 'Password'),
          m('input[type=password][name=password][required]#user-password')
        ]),
        m('div.row', [
          m('label[for=user-gender]', 'Gender'),
          m('select#user-gender[name=gender][required]', [
            m('option', ''),
            m('option[value=male]', 'Male'),
            m('option[value=female]', 'Female'),
            m('option[value=unknown]', 'Unknown')
          ])
        ]),
        m('div.row', [
          m('label[for=user-birthdate]', 'Birthday'),
          m('input[type=text][required]#user-birthdate')
        ]),
        m('div.row', [
          m('button[type=submit].sign-in-submit', 'Register')
        ])
      ])
    ]);
};

module.exports = RegisterComponent;
