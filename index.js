exports.extensionInfo = {
  extensionType: 'widget'
};

exports.runtimeAngularModulesRequires = [
                                         "markupcoe-ng",
                                        ];


                               

  // Prefer to use convention instead of configuration.
  // However, if necessary, following are the defaults that could be overriden for
  // custom configuration of where Studio should look for widget resources:

  // const extensionName = 'sample-widget-extension';
  // exports.canvasLibraries = [
  //   __dirname + '/ide/js/' + extensionName + '.canvas.js'
  // ];
  // exports.IDEFiles = [
  //   __dirname + '/ide/**/*'
  // ];
  // exports.runtimeFiles = [], // copied to runtime but not included in the page
  // exports.runtimeLibraries = [ // copied to runtime and included in the page
  //   __dirname + '/runtime/**'+'/*.js'
  // ];
  // exports.translationsBaseDirectories = [
  //   __dirname + '/locales'
  // ];
  // exports.widgetsCSS = [
  //   __dirname + '/widgets/**/*.widget.scss',
  //   __dirname + '/*.widget.scss'
  // ];
  // exports.widgetsHTML = [
  //   __dirname + '/widgets/**/*.design.html',
  //   __dirname + '/widgets/**/*.runtime.html',
  //   __dirname + '/*.design.html',
  //   __dirname + '/*.runtime.html'
  // ];
  // exports.widgetsJS = [
  //   __dirname + '/widgets/**/*.design.js',
  //   __dirname + '/*.design.js'
  // ];
