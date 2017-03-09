'use strict';

var m = require('mithril');
var AppComponent = require('./app');
var SignInComponent = require('./sign-in');

m.route(document.querySelector('main'), '/sign-in', {
  '/sign-in': {
    render: function () {
      return m(AppComponent, m(SignInComponent));
    }
  }
});
