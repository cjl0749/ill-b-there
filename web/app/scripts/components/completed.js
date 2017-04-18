'use strict';

var m = require('mithril');

var CompletedComponent = {};

CompletedComponent.view = function () {
  return m('img.completed', {src: 'images/completed.svg', alt: 'Done!'});
};

module.exports = CompletedComponent;
