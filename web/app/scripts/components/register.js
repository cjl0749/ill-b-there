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
      var fields = submitEvent.target.elements;
      Users.register({
        firstname: fields.firstname.value,
        lastname: fields.lastname.value,
        email: fields.email.value,
        password: fields.password.value,
        nationality: fields.nationality.value,
        gender: fields.gender.value,
        birthdate: fields.birthdate.value,
        onsuccess: function () {
          state.registering = false;
          state.errorRegistering = false;
          state.registered = true;
          m.redraw();
          // Show message that registration was successful for one second before
          // redirecting to sign in page
          setTimeout(function () {
            m.route.set('/sign-in');
          }, 1000);
        },
        onerror: function () {
          state.registering = false;
          state.errorRegistering = true;
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
  state.getRegisterDropdownOptions();
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
    state.registered ?
      m('Registration successful! Redirecting to sign-in page...') :
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
        m('label[for=user-nationality]', 'Nationality'),
        m('select#user-nationality[name=nationality]', [
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
        m('input[type=text][name=birthdate][required]#user-birthdate')
      ]),
      m('div.row', [
        m('button[type=submit].sign-in-submit', 'Register')
      ])
    ])
  ]);
};

module.exports = RegisterComponent;
