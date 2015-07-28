module.exports = function(grunt) {
  'use strict';

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Project configuration.
  grunt.initConfig({

    // ********** setup tasks ********** //

    shell: {
      bowerInstall: {
        command: 'bower install'
      }
    },

    // ********** linting and processing tasks ********** //

    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      js: 'js/**/*.js'
    },

    sass: {
      dev: {
        options: {
          lineNumbers: true,
          outputStyle: 'expanded'
        },
        files: {
          'assets/css/main.css': 'styles/main.scss'
        }
      },
      dist: {
        options: {
          outputStyle: 'compressed'
        },
        files: {
          'assets/css/main.min.css': 'styles/main.scss'
        }
      }
    },

    // ********** live reload tasks ********** //

    connect: {
      server: {
        options: {
          hostname: '*',
          port: 9001,
          livereload: 35729,
          open: {
            target: 'http://127.0.0.1:9001'
          }
        }
      },
      release: {
        options: {
          hostname: '*',
          port: 9002,
          keepalive: true,
          base: {
            path: 'release/'
          },
          open: {
            target: 'http://127.0.0.1:9002'
          }
        }
      }
    },

    watch: {
      css: {
        files: ['styles/*.scss'],
        tasks: ['sass:dev']
      },
      js: {
        files: 'js/**/*.js',
        tasks: 'jshint:js'
      },
      livereload: {
        options: {
          livereload: 35729
        },
        files: ['index.html', 'js/**/*', 'assets/css/**/*']
      }
    },

    // ********** build (copy, concat, uglify, clean) tasks ********** //

    copy: {
      // copy bower files over to assets and lib folders
      bower: {
        files: [{
          // CSS
          src: [ ],
          dest: 'assets/css',
          expand: true,
          flatten: true
        }, {
          // Fonts
          expand: true,
          src: [
            'bower_components/fontawesome/fonts/**'
          ],
          dest: 'assets/fonts',
          flatten: true,
          filter: 'isFile'
        }, {
          // copy over any unminified bower dependencies temporarily so that any
          // they can be processed separately instead of
          // having to run already minified files through uglify.
          src: [ ],
          dest: 'lib/bower',
          expand: true,
          flatten: true
        }]
      },
      assets: {
        files: [{
          // images in third party css structures
          cwd: 'styles/css',
          src: '**/images/**/*.{jpg,gif,png,svg}',
          dest: 'assets/images',
          expand: true,
          rename: function(destPath, filePath) {
            var startIndex = filePath.lastIndexOf('images/');
            return 'assets/' + filePath.substring(startIndex);
          }
        }]
      },
      build: {
        files: [{
          cwd: 'js',
          src: ['**', '!empty.js'],
          dest: 'release/js',
          expand: true
        }, {
          cwd: 'assets',
          src: ['**'],
          dest: 'release/assets',
          expand: true
        }, {
          src: 'lib/vendor.min.js', // all external dependencies have been concatenated into vendor
          dest: 'release',
          expand: true
        }, {
          src: 'index.html',
          dest: 'release/index.html',
          expand: false
        }]
      }
    },

    concat: {
      vendor: {
        options: {
          separator: grunt.util.linefeed + grunt.util.linefeed
        },
        files: {
          'lib/vendor.min.js': [
            // order matters here, so spell them out.
            'bower_components/underscore/underscore-min.js',
            'bower_components/jquery/dist/jquery.min.js',
            'bower_components/bootstrap-sass-twbs/assets/javascripts/bootstrap.min.js',
            'bower_components/backbone/backbone-min.js'
          ]
        }
      },
      app: {
        options: {
          banner: 'require({\ncache: {\n',
          footer: '\n}});\n(function(){ require({cache:{}}); })();',
          separator: ',' + grunt.util.linefeed,
          process: function(src, filepath) {
            var returnStr = '\n// Source: ' + filepath + '\n';

            // replace path name with package name.
            var pkgs = {
              // custom code
              'app': 'js/app',
              'components': 'js/components'
            };
            for (var key in pkgs) {
              if (pkgs.hasOwnProperty(key)) {
                if (filepath.indexOf(pkgs[key]) === 0) {
                  filepath = key + filepath.replace(pkgs[key], '');
                  break;
                }
              }
            }
            // process file
            if (filepath.indexOf('.js', filepath.length - 3) >= 0) {
              // add file name, then file text as contents of function() {}
              returnStr += '\'' + filepath.replace('.js', '') + '\': ' +
                'function() {\n' + src + '\n}';
            } else if (filepath.indexOf('.html', filepath.length - 5) >= 0) {
              // add file name as url, then html template, stripping out newlines and tabs
              returnStr += '\'url:' + filepath.replace('js/', '') + '\': ' +
                '\'' + src.replace(/\r+\s*/g, ' ').replace(/\n+\s*/g, ' ') + '\'';
              if (src.indexOf('\'') >= 0) {
                console.log('The template file ' + filepath + ' contains single quotes. This might break the build.');
              }
            } else {
              console.error('uh oh! ' + filepath + ' fell through');
              return;
            }
            return returnStr;
          }
        },
        files: {
          'release/js/app.js': [
            // everything from js folder
            'js/**/*.js',
            'js/**/*.html',
            '!js/empty.js',
            '!js/config/*'
          ]
        }
      },
    },

    uglify: {
      unmin_dep: {
        files: [{
          // put unminified bower files here, then add the minified version
          // to the concat:vendor task.
          // src: 'lib/bower/backbone.js',
          // dest: 'lib/bower/backbone-min.js'
        }]
      },
      app: {
        options: {
          sourceMap: true
        },
        files: [{
          src: 'release/js/app.js',
          dest: 'release/js/app.min.js'
        }]
      }
    },

    usemin: {
      all: ['release/index.html']
    },

    clean: {
      bower_lib: 'lib/bower',
      build: 'release'
    }

  });

  // Default task
  grunt.registerTask('default', ['serve']);

  // Custom tasks

  // Run this task on initial application setup, and any time a new bower packaged is added.
  // Make sure to add new bower js files to the copy bower task, and unminified bower js files
  // to the uglify task.
  grunt.registerTask('init', ['shell:bowerInstall', 'copy:assets', 'copy:bower', 'uglify:unmin_dep', 'concat:vendor']);

  // Run this task to process sass files, lint javascript, and start the watch server with live reload.
  grunt.registerTask('serve', ['sass:dev', 'jshint:js', 'connect:server', 'watch']);

  // Run this task to generate new release folder
  grunt.registerTask('build', ['clean:build', 'sass:dist', 'jshint:js', 'concat:app', 'copy:build', 'uglify:app', 'usemin:all', 'connect:release']);

};
