'use strict';

var m = require('mithril');
var Activities = require('../models/activities');
var LoadingComponent = require('./loading');

var ProfileComponent = {};

ProfileComponent.oninit = function (vnode) {
  var app = vnode.attrs.app;

  app.onready(function () {
    m.redraw();
    console.log(app.user);
  });
};

ProfileComponent.view = function (vnode) {
  var state = vnode.state;
  var app = vnode.attrs.app;
  return m('div.panel', app.user ? [
    m('h2.user-name', app.user.firstname + ' ' + app.user.lastname),
    m('span.birthdate', app.user.birthdate),
    m('span.email', app.user.email),
    m('span.gender', app.user.gender)
  ] : null);
};

module.exports = ProfileComponent;
