'use strict';

function App() {
  this.activity = JSON.parse(localStorage.getItem('currentActivity'));
  if (this.activity === null) {
    this.activity = {};
  }
}

// The explicit format of the activity date/time (the format accepted by the
// server)
App.prototype.dateTimeFormat = 'YYYY-MM-DD HH:mm:ss';

App.prototype.save = function () {
  localStorage.setItem('currentActivity', JSON.stringify(this.activity));
};

module.exports = App;
