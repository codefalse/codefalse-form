module.exports = function (grunt) {
    require('load-grunt-tasks')(grunt);
    grunt.initConfig({
        clean: {
            dist: {
                src: ["./dist/js/*", "./dist/css/*"],
                filter: 'isFile'
            }
        },
        babel: {
            dist: {
                files: {
                    "./dist/js/cf-file.js": ["./static/modaal/js/modaal.js", "./src/js/cf-file.js"],
                    "./dist/js/cf-input.js": "./src/js/cf-input.js"
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
                    './dist/css/cf-input.min.css': './dist/css/cf-input.css'
                }
            }
        },
        watch: {
            scripts: {
                files: ['./src/js/*.js'],
                tasks: ['babel']
            },
            lesss: {
                files: ['./src/css/*.less'],
                tasks: ['less:dist']
            }
        }
    });

    grunt.registerTask('default', ['clean', 'babel', 'uglify', 'less']);
};
