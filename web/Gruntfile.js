// Config file for Grunt, which enables automatic style/script compilation
module.exports = function(grunt) {
  'use strict';

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    // Compile Sass to CSS
    sass: {
      options: {
        cacheLocation: 'sass/.sass-cache'
      },
      external: {
        files: {
          'css/app.css': 'sass/app.scss',
        }
      }
    },

    // Automatically add vendor prefixes to compiled CSS
    postcss: {
      options: {
        map: true,
        processors: [
          require('autoprefixer')({
            browsers: '> 0.1%'
          })
        ]
      },
      styles: {
        src: 'css/*.css'
      }
    },

    // Concatenate separate JavaScript files into a single file
    concat: {
      scripts: {
        files: {
          'js/main.js': 'js/*.js',
        }
      }
    },

    // Watch for changes to files and compile as needed
    watch: {
      scripts: {
        files: [
          'js/*.js',
        ],
        tasks: [
          'concat'
        ]
      },
      styles: {
        files: [
          'sass/*.scss'
        ],
        tasks: [
          'sass',
          'postcss'
        ]
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-postcss');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('build', [
    'sass',
    'postcss',
    'concat'
  ]);

  grunt.registerTask('serve', [
    'build',
    'watch'
  ]);

};
