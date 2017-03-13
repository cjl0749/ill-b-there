'use strict';

var m = require('mithril');

var LoadingComponent = {};

LoadingComponent.view = function () {
  return m('img.loading', {src: 'images/loading.svg', alt: 'Loading...'});
};

module.exports = LoadingComponent;
