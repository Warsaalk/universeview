module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        htmlmin: {
            tmp: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true
                },
                expand: true,
                cwd: 'src/templates/cached/',
                src: '*.html',
                dest: 'tmp/js/templates/',
                ext: '.min.html'
            }
        },
        concat: {
            html: {
                options: {
                    banner: '\tc.Template.cache({\n',
                    footer: '\n\t});',
                    process: function(src, path) {
                        return "\t\t'" + /(\w+)\.min\.html/.exec(path)[1] + "': function ($__) { return `" + src + "` }";
                    },
                    separator: ',\n'
                },
                src: ['tmp/js/templates/*.min.html'],
                dest: 'tmp/js/templates.js'
            },
            locale: {
                options: {
                    // Wrapper for javascript context
                    process: function(src, filepath) {
                        var lang = filepath.match(/(\w+)\.locale\.json$/)[1].toUpperCase();
                        return 'c.Locale.add("'+lang+'", \n' + src + '\n);\n';
                    }
                },
                src: [
                    'src/js/localization/*.locale.json'
                ],
                dest: 'tmp/js/localization.js'
            },
            javascript: {
                options: {
                    // Wrapper for javascript context
                    banner: '(function(c, cName, window, $$) {\n\n',
                    footer: '\n\n})({}, "universeview", window, document);'
                },
                src: [
                    'src/js/pre/*.js',
                    'src/js-shared/*.js',
                    'src/js/*.js',
                    'src/js/common/*.js',
                    'src/js/functions/*.fn.js',
                    'src/js/helpers/*.helper.js',
                    'src/js/classes/*.class.js',
                    'src/js/features/*.feature.js',
                    'tmp/js/localization.js',
                    'tmp/js/templates.js',
                    'src/js/init/*.js'
                ],
                dest: 'tmp/extension/chrome/content/scripts/universeview.js'
            },
            javascriptbackground: {
                options: {
                    // Wrapper for javascript context
                    banner: '(function(chrome, runtime, context) {\n\n',
                    footer: '\n\n})(chrome, chrome.runtime, {});'
                },
                src: [
                    'src/js-shared/*.js',
                    'src/js-background/config.js',
                    'src/js-background/apis/*.api.js',
                    'src/js-background/features/*.feature.js',
                    'src/js-background/chromeExtensions.js',
                    'src/js-background/firefoxExtensions.js',
                    'src/js-background/init.js'
                ],
                dest: 'tmp/extension/background.js'
            },
            javascriptpagecom: {
                options: {
                    // Wrapper for javascript context
                    banner: '(function(c, cName, window) {\n\n',
                    footer: '\n\n})({}, "universeview", window);'
                },
                src: [
                    'src/js-pagecom/*.js',
                    'src/js-pagecom/actions/*.js',
                    'src/js-pagecom/handlers/*.js'
                ],
                dest: 'tmp/pagecom.js'
            },
            css: {
                src: [
                    'src/css/*.css',
                    'src/css/common/*.css',
                    'src/css/features/*.css'
                ],
                dest: 'tmp/extension/chrome/content/css/stylesheet.css'
            },
            skin: {
                src: [
                    'src/css/skin/*.css'
                ],
                dest: 'tmp/extension/chrome/content/css/skin.css'
            }
        },
        uglify: {
            dist: {
                files: {
                    'tmp/extension/chrome/content/scripts/universeview.js': ['tmp/extension/chrome/content/scripts/universeview.js'],
                    'tmp/extension/background.js': ['tmp/extension/background.js']
                }
            },
            pagecom: {
                src: ['tmp/pagecom.js'],
                dest: 'tmp/pagecom.min.js',
                options: {
                    quoteStyle: 2,
                    screwIE8: true
                }
            }
        },
        cssmin: {
            dist: {
                expand: true,
                cwd: 'tmp/extension/chrome/content/css/',
                src: ['*.css'],
                dest: 'tmp/extension/chrome/content/css/min/',
                ext: '.css'
            }
        },
        copy: {
            platform: {
                files: [
                    {expand: true, cwd: 'src/platform/google-chrome/', src: ['**'], dest: 'dist/google-chrome/'},
                    {expand: true, cwd: 'src/platform/opera/', src: ['**'], dest: 'dist/opera/'},
                    {expand: true, cwd: 'src/platform/mozilla-firefox/', src: ['**'], dest: 'dist/mozilla-firefox/'},
                    {expand: true, cwd: 'src/platform/microsoft-edge/', src: ['**'], dest: 'dist/microsoft-edge/'}
                ]
            },
            /*css: {
                expand: true,
                cwd: 'src/css/skin/',
                src: '*.css',
                dest: 'tmp/extension/chrome/content/css/'
            },*/
            images: {
                expand: true,
                cwd: 'src/img/',
                src: '**',
                dest: 'tmp/extension/chrome/content/img/'
            },
            templates: {
                expand: true,
                cwd: 'src/templates/',
                src: '*.html',
                dest: 'tmp/extension/chrome/content/templates/'
            },
            extensions: {
                files: [
                    {expand: true, cwd: 'tmp/extension', src: ['**'], dest: 'dist/google-chrome/'},
                    {expand: true, cwd: 'tmp/extension', src: ['**'], dest: 'dist/mozilla-firefox/'},
                    {expand: true, cwd: 'tmp/extension', src: ['**'], dest: 'dist/opera/'},
                    {expand: true, cwd: 'tmp/extension', src: ['**'], dest: 'dist/microsoft-edge/'}
                ]
            },
            popup: {
                expand: true,
                cwd: 'src/popup/',
                src: '**',
                dest: 'tmp/extension/chrome/popup/'
            }
        },
        'string-replace': {
            pagecom: {
                files: {
                    'tmp/extension/chrome/content/scripts/universeview.js': 'tmp/extension/chrome/content/scripts/universeview.js'
                },
                options: {
                    replacements: [{
                        pattern: '%pagecom%',
                        replacement: function () {
                            return grunt.file.read('tmp/pagecom.min.js').replace(/'/g, '\\\'');
                        }
                    }]
                }
            },
            moz: {
                files: {
                    'dist/mozilla-firefox/chrome/content/css/skin.css': 'dist/mozilla-firefox/chrome/content/css/skin.css',
                    'dist/mozilla-firefox/chrome/content/css/stylesheet.css': 'dist/mozilla-firefox/chrome/content/css/stylesheet.css'
                },
                options: {
                    replacements: [{
                        pattern: /chrome-extension:\/\/__MSG_@@extension_id__\/chrome\/content/g,
                        replacement: '..'
                    }]
                }
            },
            prod: {files: {'tmp/extension/background.js': 'tmp/extension/background.js'}, options: {replacements: [{pattern: "'%debug%'", replacement: false}]}},
            dev: {files: {'tmp/extension/background.js': 'tmp/extension/background.js'}, options: {replacements: [{pattern: "'%debug%'", replacement: true}]}},
            version_bg: {files: {'tmp/extension/background.js': 'tmp/extension/background.js',}, options: {replacements: [{pattern: "%version%", replacement: "<%= pkg.version %>"}]}},
            version_json: {
                files: {
                    'dist/google-chrome/manifest.json': 'dist/google-chrome/manifest.json',
                    'dist/microsoft-edge/manifest.json': 'dist/microsoft-edge/manifest.json',
                    'dist/mozilla-firefox/manifest.json': 'dist/mozilla-firefox/manifest.json',
                    'dist/opera/manifest.json': 'dist/opera/manifest.json'
                },
                options: {replacements: [
                    {pattern: "%version%", replacement: "<%= pkg.version %>"},
                    {pattern: "%version_name%", replacement: "<%= pkg.version_name %>"}
                ]}
            }
        },
        compress: {
            generic: {
                options: {
                    mode: 'zip',
                    archive: 'dist/generic.zip'
                },
                expand: true,
                cwd: 'tmp/extension/',
                src: ['**/*'],
                dest: ''
            },
            source: {
                options: {
                    mode: 'zip',
                    archive: 'universeview-<%= pkg.version %>.zip'
                },
                files: [
                    {expand: true, cwd: 'src/', src: ['**/*'], dest: 'src/'},
                    {
                        src: [
                            "Gruntfile.js",
                            "package.json",
                            "README.md"
                        ],
                        dest: ''
                    }
                ]
            },
            xpi: {
                options: {
                    mode: 'zip',
                    archive: 'dist/mozilla-firefox.zip'
                },
                expand: true,
                cwd: 'dist/mozilla-firefox/',
                src: ['**/*'],
                dest: ''
            },
            crx: {
                options: {
                    mode: 'zip',
                    archive: 'dist/google-chrome.zip'
                },
                expand: true,
                cwd: 'dist/google-chrome/',
                src: ['**/*'],
                dest: ''
            },
            nex: {
                options: {
                    mode: 'zip',
                    archive: 'dist/opera.zip'
                },
                expand: true,
                cwd: 'dist/opera/',
                src: ['**/*'],
                dest: ''
            },
            edge: {
                options: {
                    mode: 'zip',
                    archive: 'dist/microsoft-edge.zip'
                },
                expand: true,
                cwd: 'dist/microsoft-edge/',
                src: ['**/*'],
                dest: ''
            }
        },
        clean: {
            temp: ['tmp'],
            platform: {
                src: ['dist/google-chrome/*','dist/mozilla-firefox/*','dist/opera/*','dist/microsoft-edge/*'],
                options : {force: true}
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-crx');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-string-replace');

    grunt.registerTask('default',       ['platform','htmlcache','concat:locale','javascript','css','images','templates','string-replace:dev','popup','extensions','clean:temp']);
    grunt.registerTask('reviewers',     ['platform','htmlcache','concat:locale','javascript','css','images','templates','string-replace:dev','compress:generic','popup','extensions','zip','clean:temp']);
    grunt.registerTask('production',    ['platform','htmlcache','concat:locale','javascript','css','images','templates','string-replace:prod','compress:generic','compress:source','minify','popup','extensions','zip','clean:temp']);
    grunt.registerTask('firefox',       ['copy:platform','concat:javascriptpagecom','uglify:pagecom','htmlcache','concat:locale','javascript','css','images','templates','string-replace:dev','popup','extensions','clean:temp']);

    grunt.registerTask('platform', ['clean:platform','copy:platform','concat:javascriptpagecom','uglify:pagecom']);
    grunt.registerTask('htmlcache', ['htmlmin:tmp','concat:html']);
    grunt.registerTask('javascript', ['concat:javascript','string-replace:pagecom','concat:javascriptbackground','string-replace:version_bg']);
    grunt.registerTask('css', [/*'copy:css',*/'concat:css','concat:skin','cssmin']);
    grunt.registerTask('images', ['copy:images']);
    grunt.registerTask('templates', ['copy:templates']);
    grunt.registerTask('minify', ['uglify:dist']);
    grunt.registerTask('extensions', ['copy:extensions','string-replace:moz', 'string-replace:version_json']);
    grunt.registerTask('popup', ['copy:popup']);
    grunt.registerTask('zip', ['compress:xpi', 'compress:crx', 'compress:nex', 'compress:edge']);

}