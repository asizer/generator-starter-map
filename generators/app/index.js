'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var mkdirp = require('mkdirp');

module.exports = yeoman.generators.Base.extend({
  prompting: function() {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the\n' + chalk.red(' Esri PS-DBS ') + '\ngenerator!'
    ));

    var prompts = [{
      type: 'String',
      name: 'packageName',
      message: 'Choose a package name for this project. (no spaces!)'
    }, {
      type: 'String',
      name: 'title',
      message: 'Choose a title for this project. '
    }, {
      type: 'String',
      name: 'subtitle',
      message: 'Choose a subtitle for this project. '
    }, {
      type: 'Boolean',
      name: 'webmap',
      message: 'Will your project be using a webmap? '
    }];

    this.prompt(prompts, function(props) {
      this.name = props.packageName || 'starter-app';
      this.appTitle = props.title || 'Starter Application';
      this.subtitle = props.subtitle || 'built with Yeoman';
      this.webmap = props.webmap || false;

      done();
    }.bind(this));
  },

  writing: {
    app: function() {
      console.log('top of app', this.name, this.appTitle, this.subtitle, this.webmap);

      // setup files
      this.fs.copyTpl(
        this.templatePath('setup/_package.json'),
        this.destinationPath('package.json'),
        { name: this.name });
      this.fs.copyTpl(
        this.templatePath('setup/_bower.json'),
        this.destinationPath('bower.json'),
        { name: this.name });
      this.fs.copy(
        this.templatePath('setup/editorconfig'),
        this.destinationPath('.editorconfig'));
      this.fs.copy(
        this.templatePath('setup/jshintrc'),
        this.destinationPath('.jshintrc'));
      this.fs.copy(
        this.templatePath('setup/Gruntfile.js'),
        this.destinationPath('Gruntfile.js'));
    },

    projectfiles: function() {
      console.log('top of project files', this.name, this.appTitle, this.subtitle, this.webmap);
      this.fs.copyTpl(
        this.templatePath('_index.html'),
        this.destinationPath('index.html'), this);

      // project folder structure

      mkdirp(this.destinationPath('styles'));
      mkdirp(this.destinationPath('assets'));
      mkdirp(this.destinationPath('assets/images'));
      mkdirp(this.destinationPath('js'));
      mkdirp(this.destinationPath('js/app'));
      mkdirp(this.destinationPath('js/app/templates'));
      mkdirp(this.destinationPath('js/app/util'));
      mkdirp(this.destinationPath('js/app/views'));
      mkdirp(this.destinationPath('js/components'));
      mkdirp(this.destinationPath('js/config'));

      // style files

      this.fs.copy(
        this.templatePath('styles/main.scss'),
        this.destinationPath('styles/main.scss'));
      this.fs.copy(
        this.templatePath('styles/bootstrap.scss'),
        this.destinationPath('styles/bootstrap.scss'));
      this.fs.copy(
        this.templatePath('styles/layout.scss'),
        this.destinationPath('styles/layout.scss'));
      this.fs.copy(
        this.templatePath('styles/variables.scss'),
        this.destinationPath('styles/variables.scss'));
      this.fs.copy(
        this.templatePath('styles/header.scss'),
        this.destinationPath('styles/header.scss'));

      // application files

      // changeable files for webmap vs regular map

      if (this.webmap) {
        this.fs.copyTpl(
          this.templatePath('config/webmapconfig.js'),
          this.destinationPath('js/config/config.js'), this);
        this.fs.copy(
          this.templatePath('util/webmapcontroller.js'),
          this.destinationPath('js/app/util/MapController.js'));
      } else {
        this.fs.copyTpl(
          this.templatePath('config/config.js'),
          this.destinationPath('js/config/config.js'), this);
        this.fs.copy(
          this.templatePath('util/mapcontroller.js'),
          this.destinationPath('js/app/util/MapController.js'));
      }

      // static files

        this.fs.copy(
          this.templatePath('controller.js'),
          this.destinationPath('js/app/controller.js'));
        this.fs.copy(
          this.templatePath('util/infowindowcontroller.js'),
          this.destinationPath('js/app/util/InfoWindowController.js'));
        this.fs.copy(
          this.templatePath('util/signinutil.js'),
          this.destinationPath('js/app/util/signinUtil.js'));
        this.fs.copy(
          this.templatePath('templates/headerviewtemplate.html'),
          this.destinationPath('js/app/templates/headerViewTemplate.html'));
        this.fs.copy(
          this.templatePath('templates/layoutviewtemplate.html'),
          this.destinationPath('js/app/templates/layoutViewTemplate.html'));
        this.fs.copy(
          this.templatePath('templates/mapviewtemplate.html'),
          this.destinationPath('js/app/templates/mapviewtemplate.html'));
        this.fs.copy(
          this.templatePath('views/headerview.js'),
          this.destinationPath('js/app/views/headerView.js'));
        this.fs.copy(
          this.templatePath('views/layoutview.js'),
          this.destinationPath('js/app/views/layoutView.js'));
        this.fs.copy(
          this.templatePath('views/mapview.js'),
          this.destinationPath('js/app/views/mapview.js'));
    }
  },

  install: function() {
    this.npmInstall();
    this.on('end', function() {
      if (!this.options['skip-install']) {
        this.spawnCommand('grunt', ['init', 'serve']);
      }
    });
  }
});
