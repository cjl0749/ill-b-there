'use strict';

var m = require('mithril');

// The Next Screen button used to advance user to next screen in activity
// creation process
var NextControlComponent = {};

NextControlComponent.view = function (vnode) {
  return m('button[type=submit].next-screen-control', m('img', {
    src: 'images/next.svg',
    alt: 'Next',
    onclick: vnode.attrs.onclick
  }));
};

module.exports = NextControlComponent;
