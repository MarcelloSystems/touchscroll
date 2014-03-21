module.exports = function (grunt) {
    grunt.initConfig({
        // Read data like version info from file.
        pkg: grunt.file.readJSON('package.json'),
        banner: '<%= pkg.name %> v<%= pkg.version %> <%= grunt.template.today("yyyy-mm-dd HH:MM") %>',

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

        // Minifies and adds banner (the one defined at the top of this config)
        uglify: {
            min: {
                options: {
                    banner: '/*! <%= banner %> */',
//                    sourceMap: true,
                    compress: {
                        drop_console: true,
                        global_defs: { // Conditional compilation. Removes test/debug blocks
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
            // No reason to have keep "use strict" in prod
            stripUseStrict: {
                options: {
                    replacements: [
                        {
                            pattern: /\"use strict\";/g,
                            replacement: ''
                        }
                    ]
                },
                files: {
                    'dist/touchscroll.min.js': 'tmp/touchscroll.min.js'
                }
            },

            // Inject banner content defined at top of this config. Puts it in the given placeholder.
            setBanner: {
                options: {
                    replacements: [
                        {
                            pattern: /{{ BANNER }}/,
                            replacement: '<%= banner %>'
                        }
                    ]
                },
                files: {
                    'dist/touchscroll.js': 'src/touchscroll.js'
                }
            }

        },

        // Removes directories to keep things clean and start fresh
        clean: {
            tmp: ['tmp/'],
            dist: ['dist/'] // Only run this before making fresh build of everything
        }
    });

    // LOAD
    grunt.loadNpmTasks('grunt-tdd');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-string-replace');


    // TASKS
    grunt.registerTask('build-min', ['uglify:min', 'string-replace:stripUseStrict', 'clean:tmp']);
    grunt.registerTask('build-dev', ['string-replace:setBanner']);
    grunt.registerTask('build', ['clean:dist', 'build-min', 'build-dev']);

    grunt.registerTask('default', ['tdd:browser']);

};
