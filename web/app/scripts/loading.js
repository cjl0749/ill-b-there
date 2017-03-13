'use strict';

var m = require('mithril');

var LoadingComponent = {};

LoadingComponent.view = function () {
  return m('svg.loading', {viewBox: '0 0 320 320'}, [
    m('path', {d: 'M 40,160 A 80,80 0,0,0 280,160'})
  ]);
};

module.exports = LoadingComponent;
