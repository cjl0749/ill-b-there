'use strict';

var m = require('mithril');

var WhereComponent = {};

WhereComponent.oninit = function (vnode) {
  var state = {
    goToUserLocation: function () {
      if (navigator.geolocation) {
        // Indicate that the browser is attempting to query user's location
        state.geolocating = true;
        m.redraw();
        navigator.geolocation.getCurrentPosition(function (position) {
          state.geolocating = false;
          state.map.setCenter({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          state.map.setZoom(16);
          m.redraw();
        });
      }
    },
    initializeMap: function (mapVnode) {
      state.map = new window.google.maps.Map(mapVnode.dom, {
        // Center map at San Marcos, with the general North County area in view
        center: {lat: 33.1434, lng: -117.1661},
        zoom: 10
      });
      // Ask user for their current location and, if granted, center map at that
      // location
      state.goToUserLocation();
    }
  };
  vnode.state = state;
};

WhereComponent.view = function (vnode) {
  var state = vnode.state;
  var app = vnode.attrs.app;
  return app.initializedMap ? m('div.where', [
    state.geolocating ? m('div.panel.geolocation-panel', [
      m('h2', 'Finding you...'),
      m('p', 'Querying your current location...')
    ]) : null,
    m('div.where-map', {oncreate: state.initializeMap})
  ]) : null;
};

module.exports = WhereComponent;
