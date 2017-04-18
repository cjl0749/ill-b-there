// Brunch configuration
// See http://brunch.io for documentation.
'use strict';

module.exports = {
  paths: {
    // The directory the front end site is built to (the name 'www' is required
    // for the Cordova mobile app framework, which may eventually be integrated
    // into the app, so use 'www' as a name that's future-proof)
    public: 'www'
  },
  files: {
    // Concatenate and conpress JavaScript
    javascripts: {
      joinTo: {
        'scripts/main.js': ['app/scripts/**/*.js', /^node_modules/]
      }
    },
    // Conpile Sass to CSS
    stylesheets: {
      joinTo: {
        'styles/main.css': ['app/styles/main.scss', /^node_modules/]
      }
    }
  },
  npm: {
    // Include dependency styles as part of built project
    styles: {
      flatpickr: ['dist/flatpickr.css']
    }
  },
  modules: {
    autoRequire: {
      'scripts/main.js': ['scripts/main']
    }
  },
  plugins: {
    postcss: {
      processors: [
        require('autoprefixer')({
          browsers: ['> 0.1%']
        })
      ]
    }
  }
};
