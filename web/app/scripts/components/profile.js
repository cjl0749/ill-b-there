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
    m('h2.first-name', app.user.firstname),
    m('h2.last-name', app.user.lastname)
  ] : null);
};

module.exports = ProfileComponent;
