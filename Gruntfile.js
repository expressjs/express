module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
     bumpup: 'package.json'
});
grunt.loadNpmTasks('grunt-bumpup');
};