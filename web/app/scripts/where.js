'use strict';

var m = require('mithril');

var WhereComponent = {};

WhereComponent.oninit = function (vnode) {
  var state = vnode.state;
  vnode.state = {
    initializeMap: function (mapVnode) {
      state.map = new window.google.maps.Map(mapVnode.dom, {
        // Center map at San Marcos, with the general North County area in view
        center: {lat: 33.1434, lng: -117.1661},
        zoom: 10
      });
    }
  };
};

WhereComponent.view = function (vnode) {
  var state = vnode.state;
  var app = vnode.attrs.app;
  return app.initializedMap ?
    m('div.where', {oncreate: state.initializeMap}) :
    null;
};

module.exports = WhereComponent;
