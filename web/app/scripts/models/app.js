'use strict';

function App() {
  this.activity = JSON.parse(localStorage.getItem('currentActivity'));
  if (this.activity === null) {
    this.activity = {};
  }
  // Callbacks to run when the app is completely ready
  this.readyCallbacks = [];
  this.ready = false;
}

// The explicit format of the activity date/time (the format accepted by the
// server)
App.prototype.dateTimeFormat = 'YYYY-MM-DD HH:mm:ss';

App.prototype.save = function () {
  localStorage.setItem('currentActivity', JSON.stringify(this.activity));
};

// Queue up the given callback to run when the app is ready
App.prototype.onready = function (callback) {
  // Run callback immediately if app is already ready
  if (this.ready) {
    callback();
  } else {
    this.readyCallbacks.push(callback);
  }
};

// Signify the app is ready by running all of the set ready callbacks
App.prototype.triggerReady = function () {
  this.ready = true;
  this.readyCallbacks.forEach(function (callback) {
    callback();
  });
};

module.exports = App;
