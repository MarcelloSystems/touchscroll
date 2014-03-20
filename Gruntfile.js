
module.exports = function (grunt) {
    grunt.initConfig({
        // Read data like version info from file.
        pkg: grunt.file.readJSON('package.json'),

        // Test runner
        tdd: {
            browser: {
                files: {
                    sources: ['src/**/*.js'], // Where your application files are located
                    libs: [ // Libs loaded in order
                    ],
                    tests: ['tests/**/*-test.js'] // Where your tests are located
                },
                options: {
                    runner: 'buster', // jasmine, mocha or buster
                    expect: true, // Use the expect.js library for assertions
                    sinon: true // For spies, stubs and fake XHR
                }
            }
        },

        // Minifies and adds banner
        uglify: {
            min: {
                options: {
                    banner: "/* touchscroll v.{{ VERSION }} */",
                    compress: {
                        global_defs: {
                            "DEBUG": false
                        },
                        dead_code: true
                    }
                },
                files: {
                    'tmp/touchscroll.min.js': ['src/**/*.js']
                }
            }
        },


        // Adds version info and moves files to dist folder
        'string-replace': {
            version: {
                options: {
                    replacements: [{
                        pattern: /{{ VERSION }}/g,
                        replacement: '<%= pkg.version %>'
                    }]
                },
                files: {
                    'dist/touchscroll.min.js': 'tmp/touchscroll.min.js',
                    'dist/touchscroll.js': 'src/touchscroll.js'
                }
            }
        },

        // Removes directories to keep things clean and start fresh
        clean: {
            tmp: ['tmp/'],
            dist: ['dist/'] // Only run this as first part of build-all. If not you loose last build...
        }
    });

    // LOAD
    grunt.loadNpmTasks('grunt-tdd');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-string-replace');


    // TASKS
    grunt.registerTask('build-min', ['uglify:min', 'string-replace:version', 'clean:tmp']);
    grunt.registerTask('build-dev', ['string-replace:version']);
    grunt.registerTask('build', ['clean:dist', 'build-min', 'build-dev']);

    grunt.registerTask('default', ['tdd:browser']);

};
