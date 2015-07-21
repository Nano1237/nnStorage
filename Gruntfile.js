'use strict';

module.exports = function (grunt) {
    var browsers = [
        'Chrome',
        //'PhantomJS',
        //'Firefox'
    ];
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        karma: {
            unit: {
                options: {
                    files: [
                        'bower_components/angular/angular.js',
                        'bower_components/angular-mocks/angular-mocks.js',
                        'bower_components/chai/chai.js',
                        'build/<%= pkg.name %>.js',
                        'src/*spec.js'
                    ]
                },

                frameworks: ['mocha'],

                browsers: browsers,

                singleRun: true
            }
        },
        concat: {
            options: {
                banner: "(function(window,angular,undefined){\n",
                footer: "\n})(window,angular)",
                separator: "\n"
            },
            dist: {
                src: ['src/main.js', 'src/*.js', '!src/*spec.js'],
                dest: 'build/<%= pkg.name %>.js'
            }
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= pkg.version %> | Copyright (c) <%= grunt.template.today("yyyy") %> Tim Rücker | MIT License */\n'
            },
            build: {
                src: 'build/<%= pkg.name %>.js',
                dest: 'build/<%= pkg.name %>.min.js'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-karma');

    grunt.registerTask('test', ['karma']);

    grunt.registerTask('default', [
        'concat',
        'test',
        'uglify'
    ]);
};
