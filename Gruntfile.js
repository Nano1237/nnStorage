'use strict';

module.exports = function (grunt) {
    var browsers = [
        'Chrome',
        'PhantomJS',
        'Firefox'
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
                        '<%= pkg.name %>.js',
                        'tests/unit/*spec.js'
                    ]
                },

                frameworks: ['mocha'],

                browsers: browsers,

                singleRun: true
            }
        },
        closureCompiler: {

            options: {
                // [REQUIRED] Path to closure compiler
                compilerFile: 'node_modules/closure-compiler/lib/vendor/compiler.jar',


                // [OPTIONAL] Set Closure Compiler Directives here
                compilerOpts: {
                    /**
                     * Keys will be used as directives for the compiler
                     * values can be strings or arrays.
                     * If no value is required use null
                     *
                     * The directive 'externs' is treated as a special case
                     * allowing a grunt file syntax (<config:...>, *)
                     *
                     * Following are some directive samples...
                     */
                    compilation_level: 'ADVANCED_OPTIMIZATIONS',
                    externs: ['bower_components/cc-angular-externs/index.js', '<%= pkg.name %>.extern.js']
                    ////define: ["'goog.DEBUG=false'"],
                    //warning_level: 'verbose',
                    //jscomp_off: ['checkTypes', 'fileoverviewTags'],
                    //summary_detail_level: 3,
                    //output_wrapper: '/*! <%= pkg.name %> <%= pkg.version %> | Copyright (c) <%= grunt.template.today("yyyy") %> Tim Rücker | MIT License */\n%output%'
                }
            },

            // any name that describes your task
            main: {

                // [OPTIONAL] Target files to compile. Can be a string, an array of strings
                // or grunt file syntax (<config:...>, *)
                src: '<%= pkg.name %>.js',

                // [OPTIONAL] set an output file
                dest: '<%= pkg.name %>.min.js'
            }
        }

    });

    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-closure-tools');

    grunt.registerTask('test', ['karma']);

    grunt.registerTask('default', [
        'test',
        'closureCompiler'
    ]);
};
