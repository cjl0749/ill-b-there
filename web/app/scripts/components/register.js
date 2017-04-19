'use strict';

var m = require('mithril');
var Users = require('../models/users');
var LoadingComponent = require('./loading');

var RegisterComponent = {};

RegisterComponent.oninit = function (vnode) {
  var app = vnode.attrs.app;
  var state = {
    register: function (submitEvent) {
      // Since authentication will be performed asynchronously within
      // JavaScript, ensure that the browser does not submit the form
      // synchronously
      submitEvent.preventDefault();
      state.registering = true;
      var fields = submitEvent.target.elements;
      Users.register({
        fields: {
          firstname: fields.firstname.value,
          lastname: fields.lastname.value,
          email: fields.email.value,
          password: fields.password.value,
          nationality_id: Number(fields.nationality_id.value),
          gender: fields.gender.value,
          birthdate: fields.birthdate.value
        },
        onsuccess: function () {
          state.registering = false;
          state.errorRegistering = false;
          state.signingIn = true;
          m.redraw();
          Users.signIn({
            email: fields.email.value,
            password: fields.password.value,
            onsuccess: function (user) {
              app.user = user;
              m.route.set('/what');
            },
            onerror: function () {
              state.signingIn = false;
              m.redraw();
            }
          });
        },
        onerror: function () {
          state.registering = false;
          state.errorRegistering = true;
          state.signingIn = false;
          m.redraw();
        }
      });
    },
    getRegisterDropdownOptions: function () {
      Users.getRegisterDropdownOptions({
        onsuccess: function (data) {
          state.nationalities = data.nationalities;
          state.genders = data.genders;
        },
        onerror: function () {
          // do nothing for now
        }
      });
    },
    capitalizeGender: function (gender) {
      return gender.substr(0, 1).toUpperCase() + gender.substr(1);
    }
  };
  app.onready(function () {
    state.getRegisterDropdownOptions();
  });
  vnode.state = state;
};

RegisterComponent.view = function (vnode) {
  var state = vnode.state;
  return m('div.panel.panel-register', [
    m('h2', state.signingIn ?
        'Signing In...' :
      state.registering ?
        'Registering...' :
      'Register'
    ),
    state.errorRegistering ? m('div.row', [
      m('p.error.register-error', 'Error registering new user')
    ]) : null,
    (state.registering || state.signingIn) ?
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
        m('input[type=password][name=password][required]#user-password', {
          placeholder: 'at least 5 characters'
        })
      ]),
      m('div.row', [
        m('label[for=user-nationality]', 'Nationality (optional)'),
        m('select#user-nationality[name=nationality_id]', [
          m('option', ''),
          state.nationalities ? state.nationalities.map(function (nat) {
            return m('option', {value: nat.id}, nat.identifier);
          }) : null
        ])
      ]),
      m('div.row', [
        m('label[for=user-gender]', 'Gender'),
        m('select#user-gender[name=gender][required]', [
          m('option', ''),
          state.genders ? state.genders.map(function (gender) {
            return m('option', {value: gender}, state.capitalizeGender(gender));
          }) : null
        ])
      ]),
      m('div.row', [
        m('label[for=user-birthdate]', 'Birthday'),
        m('input[type=text][name=birthdate][required]#user-birthdate', {
          placeholder: 'YYYY-MM-DD'
        })
      ]),
      m('div.row', [
        m('button[type=submit].sign-in-submit', 'Register')
      ])
    ])
  ]);
};

module.exports = RegisterComponent;
