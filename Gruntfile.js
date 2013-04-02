/*global module:false*/
module.exports = function (grunt) {

    grunt.loadNpmTasks('grunt-rigger');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    // Project configuration.
    grunt.initConfig({
        meta: {
            version: '0.2.1',
            banner: '// Backbone.Picky, v<%= meta.version %>\n' +
              '// Copyright (c)<%= grunt.template.today("yyyy") %> Derick Bailey, Muted Solutions, LLC.\n' +
              '// Copyright (c)<%= grunt.template.today("yyyy") %> Boris Kozorovitzky.\n' +
              '// Distributed under MIT license\n' +
              '// http://github.com/BorisKozo/backbone.picky' + '\n\n'
        },

        lint: {
            files: ['src/backbone.picky.js']
        },

        rig: {
            build: {
                options: {
                    banner: '<%= meta.banner %>'
                },
                files: {
                    'lib/backbone.picky.js': ['src/backbone.picky.js']
                },
            },
            amd: {
                options: {
                    banner: '<%= meta.banner %>'
                },
                files: {
                    'lib/amd/backbone.picky.js': ['src/amd.js']
                }
            }

        },

        uglify: {
            standard: {
                options: {
                    banner: '<%= meta.banner %>'
                },
                files:{
                    'lib/backbone.picky.min.js':['lib/backbone.picky.js']
                }
            },
            amd: {
                options: {
                    banner: '<%= meta.banner %>'
                },
                files:{
                    'lib/amd/backbone.picky.min.js':['lib/backbone.picky.min.js']
                }
            }
        },

        jshint: {
            options: {
                curly: true,
                eqeqeq: true,
                immed: false,
                latedef: true,
                newcap: true,
                noarg: true,
                sub: true,
                undef: true,
                boss: true,
                eqnull: true,
                browser: true
            },
            globals: {
                jQuery: true,
                Backbone: true,
                _: true
            }
        }

    });


    // "npm test" runs these tasks
    grunt.registerTask('default', ['jshint', 'rig', 'uglify']);
    // Default task.
    //grunt.registerTask('default', ['grunt-contrib-jshint', 'rig', 'grunt-contrib-uglify']);

};
