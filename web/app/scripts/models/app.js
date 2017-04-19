'use strict';

function App() {
  this.activity = JSON.parse(localStorage.getItem('currentActivity'));
  if (this.activity === null) {
    this.activity = {};
  }
  // Callbacks to run when the app is completely ready
  this.readyCallbacks = [];
}

// The explicit format of the activity date/time (the format accepted by the
// server)
App.prototype.dateTimeFormat = 'YYYY-MM-DD HH:mm:ss';

App.prototype.save = function () {
  localStorage.setItem('currentActivity', JSON.stringify(this.activity));
};

// Queue up the given callback to run when the app is ready
App.prototype.onready = function (callback) {
  this.readyCallbacks.push(callback);
};

// Signify the app is ready by running all of the set ready callbacks
App.prototype.triggerReady = function () {
  this.readyCallbacks.forEach(function (callback) {
    callback();
  });
};

module.exports = App;
