module.exports = function (grunt) {
    require('load-grunt-tasks')(grunt);
    grunt.initConfig({
        clean: {
            temp: {
                src: './.temp'
            },
            dist: {
                src: ["./dist/js/*", "./dist/css/*"],
                filter: 'isFile'
            }
        },
        babel: {
            dist: {
                files: {
                    "./.temp/js/cf-file.js": "./src/js/cf-file.js",
                    "./dist/js/cf-input.js": "./src/js/cf-input.js"
                }
            }
        },
        concat: {
            dist: {
                files: {
                    "./dist/js/cf-file.js": ["./src/modaal/modaal.js", "./.temp/js/cf-file.js"]
                }
            }
        },
        uglify: {
            options: {
                sourceMap: true
            },
            dist: {
                files: {
                    "./dist/js/cf-file.min.js": "./dist/js/cf-file.js",
                    "./dist/js/cf-input.min.js": "./dist/js/cf-input.js",
                    "./dist/js/cf-form.min.js": ["./dist/js/cf-file.js", "./dist/js/cf-input.js"]
                }
            }
        },
        less: {
            dist: {
                files: {
                    './dist/css/cf-file.css': ['./src/modaal/modaal.css', './src/css/icon.less', './src/css/cf-file.less'],
                    './dist/css/cf-input.css': ['./src/css/cf-input.less']
                }
            },
            compress: {
                options: {
                    compress: true,
                    sourceMap: true
                },
                files: {
                    './dist/css/cf-file.min.css': './dist/css/cf-file.css',
                    './dist/css/cf-input.min.css': './dist/css/cf-input.css',
                    './dist/css/cf-form.min.css': ['./dist/css/cf-file.css', './dist/css/cf-input.css']
                }
            }
        },
        watch: {
            scripts: {
                files: ['./src/js/*.js'],
                tasks: ['babel', 'concat', 'clean:temp']
            },
            lesss: {
                files: ['./src/css/*.less'],
                tasks: ['less:dist']
            }
        }
    });

    grunt.registerTask('default', ['clean:dist', 'babel','concat', 'uglify', 'less', 'clean:temp']);
};
