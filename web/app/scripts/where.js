'use strict';

var m = require('mithril');
var LoadingComponent = require('./loading');

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
        }, function () {
          // If an error occurred while retrieving user's location, or if user
          // denies access to their location, dismiss the geolocation panel
          state.geolocating = false;
          m.redraw();
        });
      }
    },
    initializeMap: function (mapVnode) {
      state.map = new google.maps.Map(mapVnode.dom, {
        // Center map at area in San Marcos
        center: {lat: 33.1434, lng: -117.1661},
        zoom: 14
      });
      google.maps.event.addListenerOnce(state.map, 'tilesloaded', function () {
        // Ask user for their current location and, if granted, center map at
        // that location (but only after the map has loaded)
        state.goToUserLocation();
      });
    }
  };
  vnode.state = state;
};

WhereComponent.view = function (vnode) {
  var state = vnode.state;
  var app = vnode.attrs.app;
  return app.mapsApiReady ? m('div.where', [
    state.geolocating ?
      m('div.panel', [
        m('h2', 'Locating you...'),
        m(LoadingComponent)
      ]) : null,
    m('div.where-map', {oncreate: state.initializeMap}),
    m('div.screen-controls.where-controls', [
      m('label[for=where-description]', 'Description'),
      m('textarea.where-description#where-description', {
        placeholder: 'Enter any details here...'
      })
    ])
  ]) : null;
};

module.exports = WhereComponent;
