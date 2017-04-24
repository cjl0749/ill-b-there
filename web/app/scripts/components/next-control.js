'use strict';

var m = require('mithril');

// The Next Screen button used to advance user to next screen in activity
// creation process
var NextControlComponent = {};

NextControlComponent.view = function (vnode) {
  return m('button[type=submit].next-screen-control', {
    onclick: vnode.attrs.onclick
  }, m('img', {
    src: 'images/next.svg',
    alt: 'Next'
  }));
};

module.exports = NextControlComponent;
