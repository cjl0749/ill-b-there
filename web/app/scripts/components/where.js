'use strict';

var m = require('mithril');
var Activities = require('../models/activities');
var LoadingComponent = require('./loading');
var NextControlComponent = require('./next-control');

var WhereComponent = {};

WhereComponent.oninit = function (vnode) {
  var app = vnode.attrs.app;
  var state = {
    // A number of milliseconds used to determine when the user stops typing
    debounceDelay: 500,
    // The dimensions of the pin icon used to represent locations on the map
    markerWidth: 22,
    markerHeight: 40,
    // Set the location of the in-progress activity to the location residing at
    // the marker's current position
    updateActivityLocation: function () {
      var markerPosition = state.currentLocationMarker.getPosition();
      state.geocoder.geocode({
        location: markerPosition
      }, function (results, geocodeStatus) {
        if (geocodeStatus === google.maps.GeocoderStatus.OK) {
          app.activity.latitude = markerPosition.lat();
          app.activity.longitude = markerPosition.lng();
          app.activity.address = results[0].formatted_address;
          app.save();
          m.redraw();
        }
      });
    },
    updateDescription: function (inputEvent) {
      app.activity.description = inputEvent.target.value;
      // Debounce the saving of the activity description until the user has
      // finished typing
      clearTimeout(state.descDebouncer);
      state.descDebouncer = setTimeout(function () {
        app.save();
      }, state.debounceDelay);
    },
    goToUserLocation: function () {
      if (navigator.geolocation && !app.activity.latitude && !app.activity.longitude) {
        // Indicate that the browser is attempting to query user's location
        state.geolocating = true;
        m.redraw();
        navigator.geolocation.getCurrentPosition(function (position) {
          state.geolocating = false;
          var newPosition = new google.maps.LatLng(
            position.coords.latitude,
            position.coords.longitude
          );
          state.map.setCenter(newPosition);
          state.currentLocationMarker.setPosition(newPosition);
          state.map.setZoom(16);
          state.updateActivityLocation();
          m.redraw();
        }, function () {
          // If an error occurred while retrieving user's location, or if user
          // denies access to their location, dismiss the geolocation panel
          state.geolocating = false;
          m.redraw();
        });
      } else {
        state.geolocating = false;
      }
    },
    displayNearbyActivity: function (activity) {
      var nearbyActivityMarker = new google.maps.Marker({
        map: state.map,
        position: new google.maps.LatLng(activity.latitude, activity.longitude),
        icon: {
          // Use a blue pin to represent an existing, nearby activity
          url: 'images/pin-blue.png',
          scaledSize: new google.maps.Size(state.markerWidth, state.markerHeight)
        }
      });
      // Clicking a blue
      nearbyActivityMarker.addListener('click', function () {
        window.open('#!/activity/' + activity.id);
      });
    },
    loadNearbyActivities: function () {
      var currentPosition = state.currentLocationMarker.getPosition();
      Activities.getNearbyActivities({
        latitude: currentPosition.lat(),
        longitude: currentPosition.lng(),
        onsuccess: function (activities) {
          state.nearbyActivities = activities;
          state.nearbyActivities.forEach(function (activity) {
            state.displayNearbyActivity(activity);
          });
          m.redraw();
        },
        onerror: function () {
          // No need to do anything special if there's an error
        }
      });
    },
    initializeMap: function (mapVnode) {

      var initialPosition;
      if (app.activity.latitude && app.activity.longitude) {
        // Use last-chosen location if set
         initialPosition = new google.maps.LatLng(
            app.activity.latitude,
            app.activity.longitude
         );
      } else {
          // Otherwise, use default location is San Marcos
         initialPosition = new google.maps.LatLng(33.1434, -117.1661);
      }

      state.map = new google.maps.Map(mapVnode.dom, {
        // Center map at area in San Marcos
        center: initialPosition,
        zoom: 14
      });
      // Geocoder is used to convert between latitude/longitude and real-world
      // addresses
      state.geocoder = new google.maps.Geocoder();

      // Location marker is represented as a draggable drop-pin on the map
      state.currentLocationMarker = new google.maps.Marker({
        map: state.map,
        position: initialPosition,
        draggable: true,
        icon: {
          // Use a red pin to represent the
          url: 'images/pin-red.png',
          scaledSize: new google.maps.Size(state.markerWidth, state.markerHeight)
        }
      });
      state.currentLocationMarker.addListener('dragend', state.updateActivityLocation);

      google.maps.event.addListenerOnce(state.map, 'tilesloaded', function () {
        // Ask user for their current location and, if granted, center map at
        // that location (but only after the map has loaded)
        state.goToUserLocation();
      });

      state.loadNearbyActivities();

    },
    proceedToNextScreen: function () {
      app.save();
      m.route.set('/when');
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
    m('div.where-dock-bottom', [
      app.activity.address ?
        m('div.where-location', [
          m('span.where-location-label', 'Chosen Location:'),
          ' ',
          m('span.where-location-address', app.activity.address)
        ]) : null,
      m('div.screen-controls.where-controls', [
        m('textarea.where-description#where-description', {
          placeholder: 'Enter any details here (optional)',
          oninput: state.updateDescription
        }, app.activity.description),
        m(NextControlComponent, {
          onclick: state.proceedToNextScreen
        })
      ])
    ])
  ]) : null;
};

module.exports = WhereComponent;
