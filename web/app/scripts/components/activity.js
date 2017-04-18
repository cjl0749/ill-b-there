'use strict';

var m = require('mithril');
var Activities = require('../models/activities');
var LoadingComponent = require('./loading');

// An individual, existing activity
var ActivityComponent = {};

ActivityComponent.oncreate = function (vnode) {
  var state = {
    loadActivity: function () {
      state.loading = true;
      state.fetchError = false;
      state.activity = null;
      Activities.getActivity({
        data: {
          id: vnode.attrs.key
        },
        onsuccess: function (activity) {
          state.loading = false;
          state.fetchError = false;
          state.activity = activity;
          m.redraw();
        },
        onerror: function () {
          state.loading = false;
          state.fetchError = true;
          m.redraw();
        }
      });
    },
    initializeMap: function (mapVnode) {
      var locationPosition = new google.maps.LatLng(
         state.activity.latitude,
         state.activity.longitude
      );
      state.map = new google.maps.Map(mapVnode.dom, {
        center: locationPosition,
        zoom: 14
      });
      state.marker = new google.maps.Marker({
        map: state.map,
        position: locationPosition
      });
    }
  };
  vnode.state = state;
  state.loadActivity();
};

ActivityComponent.view = function (vnode) {
  var state = vnode.state;
  var app = vnode.attrs.app;
  return m('div.panel.panel-activity', [
    m('h2', state.activity ?
      'Activity - ' + state.activity.category.name :
      'Activity'),
    state.loading ?
      m(LoadingComponent) :
    state.fetchError ? [
      m('p.error', 'Error loading activity')
    ] :
    state.activity ? [
      m('span.activity-creator-name',
        'by ' + state.activity.creator.firstname + ' ' + state.activity.creator.lastname),
      state.activity.description ? [
        m('label.activity-field-name', 'Description'),
        m('div.activity-field-value', state.activity.description)
      ] : null,
      m('label.activity-field-name', 'When'),
      m('div.activity-field-value', Activities.prettifyDateTime(state.activity.event_at)),
      m('label.activity-field-name', 'Where'),
      m('div.activity-field-value', state.activity.address),
      app.mapsApiReady ?
        m('div.activity-map', {oncreate: state.initializeMap}) :
        m('p', 'Loading map...')
    ] : null
  ]);
};

module.exports = ActivityComponent;
