'use strict';

function App() {
  this.activity = JSON.parse(localStorage.getItem('currentActivity'));
  if (this.activity === null) {
    this.activity = {};
  }
}

App.prototype.save = function () {
  localStorage.setItem('currentActivity', JSON.stringify(this.activity));
};

module.exports = App;
