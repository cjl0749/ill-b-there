'use strict';

var m = require('mithril');
var moment = require('moment');
var Users = require('../models/users');
var LoadingComponent = require('./loading');

var ProfileComponent = {};

ProfileComponent.oninit = function (vnode) {
  var app = vnode.attrs.app;

  app.onready(function () {
    m.redraw();
  });
};

ProfileComponent.view = function (vnode) {
  var app = vnode.attrs.app;
  return m('div.panel.panel-profile', app.user ? [
    m('h2.user-name', app.user.firstname + ' ' + app.user.lastname),
    m('label', 'Email'),
    m('span.email', app.user.email),
    m('label', 'Birthday'),
    m('span.birthdate', moment(app.user.birthdate).format('MMMM Mo, YYYY')),
    m('label', 'Gender'),
    m('span.gender', Users.capitalizeGender(app.user.gender))
  ] : m(LoadingComponent));
};

module.exports = ProfileComponent;
