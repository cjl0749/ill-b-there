'use strict';

var m = require('mithril');
var Activities = require('../models/activities');
var LoadingComponent = require('./loading');

var WhatComponent = {};

WhatComponent.oninit = function (vnode) {
  var app = vnode.attrs.app;
  var state = {
    categories: null,
    // Load all activity categories asynchronously
    loadCategories: function () {
      Activities.getCategories({
        onsuccess: function (data) {
          state.categories = data.categories;
          m.redraw();
        },
        onerror: function () {
          state.errorLoading = true;
          m.redraw();
        }
      });
    },
    // The category slug is a human-readable (but machine-friendly) identifier
    // for a particular category
    getCategorySlug: function (category) {
      return category.name
        .toLowerCase()
        .replace(/ /gi, '-')
        // Remove all characters except alphanumeric and dashes
        .replace(/[^a-z0-9\-]/, '');
    },
    // Record the user's choice of category and move to next screen
    setCategory: function (clickEvent, category) {
      clickEvent.preventDefault();
      app.activity.category = category.id;
      app.save();
      m.route.set('/where');
    }
  };
  state.loadCategories();
  vnode.state = state;
};

WhatComponent.view = function (vnode) {
  var state = vnode.state;
  return m('div.panel.panel-what', [
    m('h2', 'What are you interested in?'),
    state.categories ?
      m('div.what-categories', state.categories.map(function (category) {
        var categorySlug = state.getCategorySlug(category);
        return m('div.what-category', {
          class: 'what-category-' + categorySlug
        }, [
          m('div.what-category-bubble', {
            onclick: function (clickEvent) {
              state.setCategory(clickEvent, category);
            }
          }, m('img.what-category-icon', {
            src: 'images/categories/' + categorySlug + '.svg',
            alt: category.name
          })),
          m('span.what-category-name', category.name)
        ]);
      })) :
    state.errorLoading ?
      m('p.error', 'Sorry, categories cannot be loaded at this time.') :
      m(LoadingComponent)
  ]);
};

module.exports = WhatComponent;
