'use strict';

var m = require('mithril');

var LoadingComponent = {};

LoadingComponent.view = function () {
  return m('div.loading', [
    m('img', {src: 'images/loading.svg', alt: 'Loading...'})
  ]);
};

module.exports = LoadingComponent;
