'use strict';

var m = require('mithril');

var AppComponent = {};

AppComponent.view = function (vnode) {
  return [
    m('header.app-header', [
      m('h1.app-title', 'I\'ll B There')
    ]),
    // AppComponent acts as a layout which accepts any arbitrary sub-component
    // for content (this is to avoid duplication of static components, such as
    // the header and footer, across several components); see main.js
    m(vnode.attrs.ContentComponent, {app: vnode.attrs.app})
  ];
};

module.exports = AppComponent;
